🏗️ TalentStream AI - System Architecture
This document outlines the technical framework used to consolidate fragmented candidate data into a unified recruiter dashboard.

1. Data Ingestion Layer
Since the MVP prohibits live API integrations, we utilize a Semi-Automated Ingestion approach:

Data Sources: Synthetic datasets representing Internal ATS (System of Record) and LinkedIn (System of Engagement).

Format: Standardized JSON objects to simulate real-world API responses.

2. The Processing Engine (The "Science")
The core of the application lies in the performSync() function within script.js. It follows a 3-step pipeline:

A. Entity Resolution (Deduplication)
We use the Email Address as the Primary Key (UUID).

Logic: The system creates a Map() where the key is the email. If a duplicate email is found from a different source, the system merges the attributes instead of creating a new card.

B. Conflict Detection Logic
The engine compares specific data fields across sources.

Strict Matching: Fields like Location are compared. If Source_A.Location !== Source_B.Location, a Conflict Flag is raised.

Attribute Merging: The system tracks the origin of each piece of data, allowing the recruiter to see which platform provided which info.

3. UI/UX Strategy
The dashboard is designed for High-Speed Decision Making:

Unified Candidate Card: Consolidates all source tags and data points into one view.

Visual Priority: Conflicts are highlighted with Warning Colors (#f59e0b) to prevent recruiters from acting on outdated information.

Analytics Layer: Integration of Chart.js provides a high-level view of talent distribution, helping teams identify which source provides the most unique talent.

4. Scalability Roadmap
While currently a frontend MVP, the architecture is designed to scale:

Phase 1: Manual CSV/JSON Ingestion (Current).

Phase 2: Fuzzy Matching implementation (handling name variations like "Jon" vs "John").

Phase 3: Backend integration with PostgreSQL for persistent storage.
