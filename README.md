<a id="readme-top"></a>

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/your_username/Wonderfool">
    <img src="./Assets/logo.png" alt="Wonderfool Logo" width="120" height="120" />
  </a>

  <p align="center">
    A premium, cinematic database and community platform for Anime, Manga, and Light Novels.
    <br />
    <em>Netflix/Apple TV-style browsing, meets Letterboxd-style community tracking.</em>
    <br />
    <div align="center">
    <img src="Making-Game\Assets\Project\Player\Sprites\FERN ATK 1 PROJECTILE FINAL.png" width="800"/>
    </div>
    <br />
    
  </p>
  <div align="center">
</div>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#core-features--pages">Core Features & Pages</a></li>
    <li><a href="#design-language--aesthetics">Design Language & Aesthetics</a></li>
    <li><a href="#database-schema">Database Schema</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

**Wonderfool** is a full-stack database and community platform for Anime, Manga, and Light Novels, built to feel like a premium streaming service rather than a typical wiki or tracker.Our main goal is to bring authors, artists, creators, and other contributors into the limelight by highlighting their work and achievements. It allows users to discover, track, review, and appreciate both the content and the people behind it. The experience is designed around cinematic hero carousels, smooth micro-interactions, and rich imagery — prioritizing a beautiful browsing experience as much as a functional one.

Real content data is seeded directly from the **AniList GraphQL API**, giving the platform genuine, up-to-date anime and manga metadata rather than placeholder content — supplemented with manually curated entries for pure web novels, which AniList doesn't cover.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
* [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
* [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
* [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
* [![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
* [![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
* [![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com/)
* [![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
* [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
* [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
* [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
* [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CORE FEATURES -->
## Core Features & Pages

### 🏠 Home Page (`/`)
* **Cinematic Hero Carousel** — auto-rotating showcase of popular anime with dark gradients, slow-zooming background art, and Cinzel-font typography
* **Curated Collections** — horizontal scrolling grids for Top Anime, Top Manga, Top Light Novels, and New Releases
* Dynamic fetching, sorted by `averageScore`, `popularity`, and `startDate`

### 🔍 Browse Page (`/browse`)
* **Filter Engine** — Media Type, Status, Genre, Year, and Country of Origin
* **Sorting** — Most Popular, Highest Rated, Newest, Oldest
* **URL Syncing** — filters sync to query params (e.g. `?type=ANIME`), so links from Home carry filters straight into Browse

### 📖 Series Detail Page (`/series/:id`)
* Full metadata: synopsis, characters, staff, and related adaptations

### ✍️ Article System (`/articles`)
* Full authoring flow — title, rich body, cover image (Cloudinary-backed upload), creator/series tagging
* Real publish flow backed by MongoDB, with author-only edit/delete permissions
* Article detail pages with tagged creators/series, comments, and likes

### 👤 Community & Profile
* Real Firebase authentication (email/password + Google OAuth)
* User profiles with Reviews, Articles, Timeline, and Wishlist tabs
* Wishlist tracking with status (Plan to Watch / In Progress / Completed / etc.)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DESIGN LANGUAGE -->
## Design Language & Aesthetics

The core identity of Wonderfool relies on a warm, editorial character. The whole palette reads as warm and gallery-like—closer to a museum catalog or a premium print magazine than a typical tech-blue SaaS product. Every custom component (Perspective Grid, Animated Footer, parallax galleries) is deliberately themed to preserve this warm gold identity.

### 🎨 Core Color Palette

| Token / Element | Light Mode | Dark Mode | Description |
| :--- | :--- | :--- | :--- |
| **Primary (Gold)** | `#987F23` | `#f3bf5f` | The signature hue. Darkened in light mode for crisp legibility; warm and saturated in dark mode. |
| **Background** | `#F8F5E3` | `Near-Black` | Warm cream/ivory (not pure white) for light mode; deep canvas black for the "gallery at night" feel. |
| **Muted Text** | `#594B30` | `Warm Gray` | A warm brown-gray tone for timestamps and labels, keeping it in the gold family rather than a default Tailwind neutral. |
| **Borders** | `rgba(171,142,44,0.45)`| `Gold-Tinted` | Semi-transparent dividers that carry a hint of the signature gold hue rather than a flat gray line. |

### ✨ Supporting Tones & Gradients
Interactive elements (like the "Add to Timeline" buttons) use smooth gradient transitions rather than flat single-color fills:  
`bg-gradient-to-r from-accent via-secondary to-primary`  
The `--accent` and `--secondary` tokens sit in the same warm gold/amber family at different saturations to create depth.

### 🔤 Typography Pairing
* **Headings (Cinzel / Cormorant Garamond):** An editorial serif that reinforces the authoritative, curated library feel.
* **Body (Inter):** Clean, modern, and highly legible, providing a sharp contrast against the decorative heading font for UI data.

### 🖱️ Motion & Material
* **Micro-interactions** — Subtle 3D card lift on hover (`scale: 1.03`), glowing borders, and delayed text reveals.
* **Glassmorphism** — Backdrop blurs, semi-transparent overlays, and glossy reflections for depth.
* **Oliver Parallax** — each column moves up/down at a different speed relative to how far the user has scrolled
* **Perspective Grid** — 3D tilted background that reacts to cursor movement

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DATABASE SCHEMA -->
## Database Schema

Core MongoDB collections (via Mongoose):

| Collection | Key Fields |
|---|---|
| **Series** | `title` (romaji/english/native), `type`, `status`, `genres`, `countryOfOrigin`, `staff`, `adaptations`, `characters`, `coverImage`, `bannerImage` |
| **Article** | `title`, `body`, `authorId`, `taggedCreators`, `taggedSeries`, `coverImage`, `likes`, `status` |
| **Review** | `seriesId`, `userId`, `rating`, `text`, `likes` |
| **User** | `name`, `email`, `firebaseUid`, `avatar` |
| **Person** | Creator/staff records referenced by Series and Article |
| **Wishlist** | `userId`, `seriesId`, `status` |
| **Comment** | Polymorphic comments on Articles and Reviews, with reply threading |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->
## Project Structure

```
Wonderfool/
├── Client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level pages
│       ├── hooks/          # Data-fetching hooks
│       ├── store/          # Zustand stores (auth, etc.)
│       └── lib/            # API client, Firebase config
└── Server/                 # Node + Express backend
    ├── config/             # DB, Firebase
    ├── controllers/        # Route handlers
    ├── middleware/          # Auth verification, file upload
    ├── models/             # Mongoose schemas
    ├── routes/             # Express route definitions
    └── scripts/            # AniList/Anime/Manga seed scripts
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Series database with AniList-seeded data
- [x] Home page with cinematic hero carousel
- [x] Browse page with full filter engine
- [x] Real Firebase authentication (email + Google OAuth)
- [x] Cloudinary image upload pipeline
- [x] Real Article creation, backed by MongoDB
- [x] Article Detail page wired to real API data (currently mock)
- [x] Real creator/series tagging in Article Editor (currently mock picklists)
- [x] Community feed with real sorting (most liked / most recent)
- [x] Timeline page real API integration
- [x] Article like/comment system
- [ ] Integration of Larp Meter
- [ ] Integration of Algorithm to prevent Review Bombing
- [ ] Anime Episodes Details in series detail page

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

### Team

<a href="https://github.com/preet3375"><img src="https://images.weserv.nl/?url=github.com/preet3375.png&h=60&w=60&fit=cover&mask=circle" width="60px" alt="preet3375"/></a>
<a href="https://github.com/divitsambodhi"><img src="https://images.weserv.nl/?url=github.com/divitsambodhi.png&h=60&w=60&fit=cover&mask=circle" width="60px" alt="divitsambodhi"/></a>
<a href="https://github.com/Abhishek-017i"><img src="https://images.weserv.nl/?url=github.com/Abhishek-017i.png&h=60&w=60&fit=cover&mask=circle" width="60px" alt="Abhishek-017i"/></a>
<a href="https://github.com/sumitkarkhede"><img src="https://images.weserv.nl/?url=github.com/sumitkarkhede.png&h=60&w=60&fit=cover&mask=circle" width="60px" alt="sumitkarkhede"/></a>
<!-- CONTACT -->
## Contact
Abhishek : [IG Handle 📸](https://www.instagram.com/abhishek_017i?igsh=a25wNGJ4a3NjazJu)
</br>
Project Link: [https://github.com/Abhishek-017i/Wonderfool](https://github.com/your_username/Wonderfool)

<p align="right">(<a href="#readme-top">back to top</a>)</p>