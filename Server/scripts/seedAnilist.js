require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const connectDB = require('../config/db');
const Series = require('../models/Series');
const Person = require('../models/Person');

const ANILIST_URL = 'https://graphql.anilist.co';
const TARGET_COUNT = 1000; 
const PER_PAGE = 50;

//Helper functions

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
//-----------------------------------------------------
function mapStatus(aniListStatus) {
  const statusMap = {
    RELEASING: 'ongoing',
    FINISHED: 'finished',
    NOT_YET_RELEASED: 'ongoing',
    CANCELLED: 'cancelled',
    HIATUS: 'hiatus',
  };
  return statusMap[aniListStatus] || 'ongoing';
}
//-----------------------------------------------------
function isRelevantStaff(edge) {
  const role = edge.role.toLowerCase();
  const occupations = edge.node.primaryOccupations || [];

  const excludedKeywords = ['english', 'italian', 'spanish', 'german', 'french', 'adr', 'dub', 'storyboard (op', 'storyboard (ed'];
  if (excludedKeywords.some(keyword => role.includes(keyword))) {
    return false;
  }

  const relevantOccupations = ['Director', 'Mangaka', 'Voice Actor', 'Original Creator', 'Character Design', 'Music'];
  return occupations.some(occ => relevantOccupations.includes(occ));
}
//-----------------------------------------------------
async function fetchAnimePage(page, perPage = 50) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          format
          countryOfOrigin
          description
          genres
          status
          startDate { year month day }
          endDate { year month day }
          episodes
          chapters
          volumes
          averageScore
          coverImage { large }
          bannerImage
          staff(perPage: 5) {
            edges {
              role
              node {
                id
                name { full native }
                image { large }
                description
                primaryOccupations
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(ANILIST_URL, {
    query,
    variables: { page, perPage },
  });

  return response.data.data.Page;
}

async function fetchMangaPage(page, perPage = 50) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(type: MANGA, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          format
          countryOfOrigin
          description
          genres
          status
          startDate { year month day }
          endDate { year month day }
          episodes
          chapters
          volumes
          averageScore
          coverImage { large }
          bannerImage
          staff(perPage: 5) {
            edges {
              role
              node {
                id
                name { full native }
                image { large }
                description
                primaryOccupations
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(ANILIST_URL, {
    query,
    variables: { page, perPage },
  });

  return response.data.data.Page;
}
//-----------------------------------------------------
function transformToSeries(media) {
  const relevantStaff = media.staff.edges.filter(isRelevantStaff);

  return {
    aniListId: media.id,
    title: {
      romaji: media.title.romaji,
      english: media.title.english,
      native: media.title.native,
    },
    type: media.format === 'MANGA' ? 'MANGA' : media.format === 'NOVEL' ? 'NOVEL' : 'ANIME',
    countryOfOrigin: media.countryOfOrigin,
    synopsis: stripHtml(media.description),
    genres: media.genres,
    status: mapStatus(media.status),
    startDate: media.startDate.year
      ? new Date(media.startDate.year, (media.startDate.month || 1) - 1, media.startDate.day || 1)
      : undefined,
    endDate: media.endDate.year
      ? new Date(media.endDate.year, (media.endDate.month || 1) - 1, media.endDate.day || 1)
      : undefined,
    episodeCount: media.episodes,
    chapterCount: media.chapters,
    volumeCount: media.volumes,
    coverImage: media.coverImage.large,
    bannerImage: media.bannerImage,
    averageScore: media.averageScore,
    _rawStaff: relevantStaff,
  };
}
//-----------------------------------------------------
async function findOrCreatePerson(staffNode) {
  let person = await Person.findOne({ aniListId: staffNode.id });

  if (!person) {
    person = await Person.create({
      aniListId: staffNode.id,
      name: {
        full: staffNode.name.full,
        native: staffNode.name.native,
      },
      photo: staffNode.image ? staffNode.image.large : '',
      bio: stripHtml(staffNode.description),
      designation: staffNode.primaryOccupations || [],
      knownWorks: [],
    });
  }

  return person;
}
//-----------------------------------------------------
async function linkStaffToSeries(rawStaffEdges, seriesId) {
  const staffArray = [];

  for (const edge of rawStaffEdges) {
    const person = await findOrCreatePerson(edge.node);

    staffArray.push({
      personId: person._id,
      designation: edge.role,
    });

    const alreadyLinked = person.knownWorks.some(
      work => work.seriesId.toString() === seriesId.toString()
    );

    if (!alreadyLinked) {
      person.knownWorks.push({
        seriesId: seriesId,
        designation: edge.role,
      });
      await person.save();
    }
  }

  return staffArray;
}
//-----------------------------------------------------------------------------------------------------------


async function seedMedia(mediaType, targetCount) {
  await connectDB();

  let page = 1;
  let totalSeeded = 0;

  while (totalSeeded < targetCount) {
    console.log(`Fetching page ${page} (${mediaType})...`);
    const result = mediaType === 'ANIME'
      ? await fetchAnimePage(page, PER_PAGE)
      : await fetchMangaPage(page, PER_PAGE);

    for (const media of result.media) {
      const existing = await Series.findOne({ aniListId: media.id });
      if (existing) {
        console.log(`Skipping "${media.title.romaji}" — already seeded`);
        continue;
      }

      const seriesData = transformToSeries(media);
      const rawStaff = seriesData._rawStaff;
      delete seriesData._rawStaff;

      const savedSeries = await Series.create(seriesData);
      const staffArray = await linkStaffToSeries(rawStaff, savedSeries._id);

      savedSeries.staff = staffArray;
      await savedSeries.save();

      console.log(`Seeded: ${media.title.romaji}`);
      totalSeeded++;

      if (totalSeeded >= targetCount) break;
    }

    if (!result.pageInfo.hasNextPage) {
      console.log('No more pages available from AniList.');
      break;
    }

    page++;
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log(`\nDone. Seeded ${totalSeeded} ${mediaType} series total.`);
  mongoose.connection.close();
}

module.exports = { seedMedia };