export const dynamic = 'force-static';

const baseUrl = 'https://ghstories.xyz';

const body = `
ghstories - full product and feature context for language models
===============================================================

High-level summary
------------------
ghstories (hosted at ${baseUrl}) turns GitHub commits into short-lived, story-like updates ("stories") so developers can share their day-to-day coding activity in a lightweight, visual feed.

The core ideas:
- Every push to a connected GitHub repository becomes an ephemeral story.
- Stories expire after 24 hours by default, mirroring social media stories.
- Developers can pin important stories as "highlights" that persist on their profile.
- The app mirrors a developer's GitHub following graph into ghstories, building an instant feed of activity.
- Stories are viewable in a Story Viewer component that supports sequential navigation, read/unread state, and deep linking via URLs.

Primary user journeys
---------------------

1) New visitor discovering ghstories
   - Enters through the landing page at ${baseUrl}/.
   - Sees the hero message "Turn your commits into stories".
   - Reads how ghstories works in three steps:
     1) Connect one or more GitHub repositories.
     2) Push commits as usual; each push creates a story automatically.
     3) View and share stories in a feed, and save favorites as highlights.
   - Understands key properties: 24h expiry, real-time updates, and that ghstories is free and open source.
   - Action: clicks "Get started with GitHub" to sign in and begin connecting repos.

2) Authenticated developer using ghstories
   - Signs in with GitHub via better-auth and authClient.
   - After login, the primary call-to-action on the landing page changes to "View Feed" (linking to ${baseUrl}/feed).
   - The developer navigates between:
     - Landing page (overview, marketing copy, and how it works).
     - Feed (stories from themselves and people they follow).
     - Profile (their own page for highlights and repo connections).
     - Individual stories (deep-links for sharing or focused viewing).

3) Connecting repositories
   - Location: own profile page at ${baseUrl}/profile/[username].
   - Flow:
     - The "Repositories" section lists currently connected repositories (fetched via Convex query connectedRepos.listByUser).
     - The user can open a list of repos available for connection using a Convex action (github.listReposForConnect) that:
       - Uses an access token from GitHub OAuth via authClient.
       - Returns a list of repos plus information about which are already connected.
     - For each unconnected repo, the user can click "Connect" which triggers a Convex action (github.createWebhook):
       - This sets up a webhook on GitHub so that new commits are sent to ghstories.
     - Connected repos can be disconnected using github.deleteWebhook, which:
       - Removes the webhook from GitHub.
       - Stops new commits from that repo from generating stories.
   - Key data fields in this flow:
     - repositoryFullName (e.g. owner/repo).
     - userId (ghstories-internal user identifier).
     - accessToken (GitHub OAuth token, used only on the server side).

4) Viewing the feed
   - Location: ${baseUrl}/feed.
   - The feed page fetches:
     - stories.listFeed - stories from people the user follows plus their own stories.
     - stories.listMyStories - the user's own stories, used for empty states and personalization.
   - Logic:
     - Stories are aggregated into a single list and sorted by createdAt descending to show newest activity at the top.
     - The page groups stories by userId to construct:
       - Story bubbles: small, circular or pill-shaped elements that display:
         - The developer's avatar and username.
         - Number of stories in the last 24 hours.
         - A visual indicator if there are any unviewed stories (viewCount === 0).
       - Feed cards: each group of stories per user appears as a card with:
         - Name, story count, latest commit message excerpt, date, and repo name.
   - Story navigation:
     - Clicking a story bubble or feed card:
       - Filters stories to the selected user.
       - Sorts their stories by createdAt ascending.
       - Jumps to the first unviewed story if any exist, otherwise to the first story.
     - The Story Viewer overlay allows:
       - Next / previous navigation between a user's stories.
       - Closing the viewer to return to the feed.

5) Viewing an individual story
   - Location: ${baseUrl}/stories/[id].
   - The StoryPage route:
     - Accepts a dynamic segment "id" (the story's unique identifier).
     - Queries Convex (stories.get) to load that story and determine its userId.
     - Queries stories.listUserStories for that user to build a sorted list of all their stories.
     - Determines currentStoryIndex using:
       - Whether all stories have been viewed (allViewed).
       - Whether the current story is the last one.
     - Renders the Story Viewer with:
       - allStories: the sorted list of stories for that user.
       - currentIndex: the index for the current story.
       - hasNext / hasPrevious booleans.
       - onNext / onPrevious handlers that navigate between /stories/[id] URLs.
   - Behavior:
     - If the story is not found, the route:
       - Displays a "Story not found" message.
       - Offers a button to go back to the feed at ${baseUrl}/feed.

6) Profile experience
   - Location: ${baseUrl}/profile/[username].
   - Data:
     - Uses Convex query follows.getProfile to fetch:
       - Profile user record (id, username, displayName, avatarUrl, etc.).
       - Whether the current user follows this profile (isFollowing).
       - Highlight stories for this user.
   - Visitors viewing someone else's profile:
     - See the avatar, display name, and @username.
     - See a Follow / Unfollow button that calls Convex mutations follows.follow or follows.unfollow.
     - Can open and view highlight stories in the Story Viewer.
   - Owners viewing their own profile:
     - See the same profile header.
     - Access the Repositories section to manage repo connections (see "Connecting repositories").
     - See the Highlights grid, where:
       - Each highlight is a saved story with:
         - Commit message excerpt (first line).
         - View count indicator.
         - Pin icon showing whether the story is currently marked as highlight.
       - Clicking a highlight opens the Story Viewer for that story.
       - Clicking the pin button toggles highlight status with Convex mutations stories.setHighlight and stories.unsetHighlight.
     - See an Insights panel with:
       - Total Views: sum of viewCount across highlight stories.
       - Highlights: number of highlight stories.
       - Avg Views: average viewCount per highlight story.

7) Following graph and synchronization
   - ghstories keeps its internal "follows" graph approximately in sync with GitHub:
     - A scheduled cron route at /api/cron/sync-github-following periodically calls a Convex action that:
       - Fetches the user's following list from the GitHub API.
       - Updates ghstories' follows data.
     - A manual API route at /api/sync-github-following can also trigger the same behavior.
   - Effects:
     - When you follow or unfollow someone on GitHub, ghstories will eventually mirror that change.
     - The Stories feed uses this graph to decide whose stories to show.

8) Story model and lifecycle details
   - A story is created whenever:
     - A commit event is received from a GitHub webhook on a connected repository.
   - Core fields (conceptually):
     - id: unique identifier for the story.
     - userId: ID of the ghstories user who owns the repo.
     - commit: nested object with:
       - message: full commit message string.
       - repositoryName: name (or full name) of the source repository.
       - potentially other metadata like commit SHA or URL.
     - createdAt: numeric or ISO timestamp representing when the story was created.
     - viewCount: integer count of how many times the story has been viewed.
     - isHighlight: boolean for whether this story is saved as a highlight.
   - Expiry:
     - The UI and product messaging state that stories are ephemeral with 24h expiry.
     - Highlights, however, are long-lived and persist until unpinned.

9) UI and interaction design
   - The app uses a sketchy, hand-drawn aesthetic with:
     - Cabin Sketch as a key font, via next/font.
     - SVG borders and underlines drawn using motion/react for animated paths.
   - Global layout:
     - Implemented in app/layout.tsx with:
       - Sidebar navigation and a bottom sidebar variant.
       - Navbar at the top of the content column.
       - A "SketchyGrid" background that adds texture.
     - The layout wraps children with:
       - ConvexClientProvider to provide Convex client and initial token.
       - Providers and StoryViewerOpenProvider for app-wide context.
   - Landing page sections:
     - Hero: big typography, animated underline, and live preview card.
     - "How it works": three-step grid describing connect → push → stories.
     - "Why ghstories": explains repo connection and follow sync features.
   - Feed and profile use Motion for smooth animations (enter/hover) and emphasize a playful but legible interface.

10) SEO and discoverability endpoints
    - Metadata (app/layout.tsx):
      - Title: "ghstories - Turn your commits into stories".
      - Description: how every push becomes an ephemeral story for the dev community.
      - Keywords: ghstories, GitHub stories, commit stories, developer social feed, code storytelling, etc.
      - Open Graph:
        - og:title, og:description, og:image at ${baseUrl}/og.png.
      - Twitter card: summary_large_image using the same OG image.
    - Sitemap (app/sitemap.ts):
      - Declares main URLs:
        - ${baseUrl}/
        - ${baseUrl}/feed
        - ${baseUrl}/stories
        - ${baseUrl}/stories/example-story-id (documenting the dynamic story pattern).
        - ${baseUrl}/profile/example-username (documenting the dynamic profile pattern).
        - ${baseUrl}/llms.txt
        - ${baseUrl}/llms-full.txt
      - Uses changeFrequency hints like daily or hourly.
    - Robots (app/robots.ts):
      - Allows crawling of the entire site except:
        - /api/ and /_next/ (internal API and build assets).
      - Declares sitemap at ${baseUrl}/sitemap.xml and host at ${baseUrl}.
    - Manifest (app/manifest.ts):
      - Defines name, short_name, description, start_url, theme_color, background_color, and icons.
      - Icons are served from /icons/icon-192.png and /icons/icon-512.png.

11) Authentication and authorization details
    - ghstories uses better-auth and @convex-dev/better-auth integration.
    - The server-side getToken function (imported in layout.tsx) retrieves an auth token for ConvexClientProvider.
    - The client-side useAuth hook exposes:
      - signIn: entry point for GitHub sign-in.
      - isAuthenticated / isLoading: booleans for auth state.
      - user: the current user object, which includes id and (optionally) username.
    - Protected experiences:
      - Feed at ${baseUrl}/feed requires sign-in; otherwise it prompts to sign in.
      - Profile editing and repo connection actions require the current user to match the profile owner.
      - Story viewing respects user identity for metrics like viewCount and insights.

12) Technology stack
    - Framework: Next.js App Router (version ~16.x) using the /app directory.
    - Backend / data layer: Convex, with:
      - Queries (useQuery) for reactive data fetching.
      - Mutations and actions for writes and external API calls.
    - Auth: better-auth with GitHub provider and @convex-dev/better-auth for Convex integration.
    - UI:
      - React 19.
      - motion (Framer Motion-style library) for animations.
      - lucide-react for icons.
      - Tailwind CSS v4 for styling.
    - Deployment: any environment compatible with Next.js 16 and Convex (not specified here).

13) Usage examples for LLMs
    - If a user asks: "What is ghstories?"
      - Answer: ghstories is a web app at ${baseUrl} that turns GitHub commits into ephemeral stories, giving developers a story-based feed of activity sourced directly from their connected repositories and GitHub following graph.
    - If a user asks: "How do I connect a repository to ghstories?"
      - Answer:
        - Sign in with GitHub at ${baseUrl}/.
        - Go to your profile page at ${baseUrl}/profile/[your-username].
        - In the "Repositories" section, load available repos, then click "Connect" on any repo you want to send commits from.
        - ghstories will add a webhook on that repo and start turning new commits into stories.
    - If a user asks: "How does the feed decide which stories to show?"
      - Answer: The feed at ${baseUrl}/feed shows stories from two sources: your own commits from connected repositories, and commits from people you follow on GitHub (mirrored into ghstories via scheduled and manual follow sync).
    - If a user asks: "Can I save important stories so they don't disappear?"
      - Answer: Yes. On your profile page at ${baseUrl}/profile/[username], you can pin any story as a highlight. Highlights appear in a dedicated section and persist beyond the normal 24h expiry of stories.

Key URLs recap
--------------
- Home / landing: ${baseUrl}/
- Feed: ${baseUrl}/feed
- Story (pattern): ${baseUrl}/stories/[id]
- Story (example): ${baseUrl}/stories/example-story-id
- Profile (pattern): ${baseUrl}/profile/[username]
- Profile (example): ${baseUrl}/profile/example-username
- LLM short context: ${baseUrl}/llms.txt
- LLM full context: ${baseUrl}/llms-full.txt
`.trimStart();

export async function GET() {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
