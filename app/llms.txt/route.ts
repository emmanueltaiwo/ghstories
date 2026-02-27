export const dynamic = 'force-static';

const baseUrl = 'https://ghstories.xyz';

const body = `
ghstories is a web app that turns GitHub commits into ephemeral, story-like updates that are easy to browse and share.
It is built for developers who want a lightweight, visual feed of what they and their network are building in real time.

Core concepts:
- GitHub commits are transformed into "stories" that expire after 24 hours, similar to social stories.
- Developers connect one or more GitHub repositories; webhooks stream new commits into ghstories automatically.
- Following on GitHub is mirrored into ghstories so your feed is instantly filled with activity from people you already follow.
- Stories can be saved as permanent "highlights" on a profile so your best work does not disappear.

Key pages and features:

1) Landing page - overview of ghstories
   - URL: ${baseUrl}/
   - Purpose: Explain ghstories, its value, and how it works.
   - Highlights:
     - Hero section: "Turn your commits into stories" with a clear explanation that every push becomes an ephemeral story.
     - Feature badges: "24h expiry", "Real-time", "Free forever".
     - "How it works" section that outlines three steps:
       1) Connect your repo using GitHub sign-in and a webhook.
       2) Push commits as usual; each push becomes a story automatically.
       3) Stories appear in the feed; you can follow others and pin favorites as highlights.
     - "Why ghstories" section describing:
       - Repository connection flow (no manual webhook config required).
       - Automatic syncing of your GitHub following list so your ghstories feed matches who you follow on GitHub.
   - Primary actions:
     - "Get started with GitHub" button that triggers GitHub OAuth sign-in.
     - Authenticated users see a "View Feed" button that links to ${baseUrl}/feed.

2) Feed page - stories from you and people you follow
   - URL: ${baseUrl}/feed
   - Purpose: Show a feed of recent commit stories from the current user and followed developers.
   - Behavior:
     - Uses Convex queries (stories.listFeed and stories.listMyStories) to fetch stories for the logged-in user.
     - Groups stories by user and surfaces them as "story bubbles" with counts and read/unread state (based on viewCount).
     - Clicking a story bubble opens the Story Viewer overlay, allowing navigation through a user's stories in chronological order.
   - States:
     - If the user is not signed in, the feed prompts them to sign in to see their feed.
     - If there are no stories yet, the UI explains that you can connect a repo or follow others to populate your feed.
   - Key elements for LLMs:
     - Story bubble components show username, repo name, commit message excerpt, date, and story count.
     - The feed is personalized; it depends on authenticated user context.
     - Navigation is optimized to jump to the first unviewed story for a user, then progress through the rest.

3) Story page - direct link to a single story
   - URL pattern: ${baseUrl}/stories/[id]
   - Example: ${baseUrl}/stories/example-story-id
   - Purpose: Deep-link into an individual story so it can be shared or opened outside the main feed.
   - Behavior:
     - Loads a specific story by its ID, then fetches all stories for the same user to build a per-user story sequence.
     - The Story Viewer provides "next" and "previous" navigation between stories from that same user.
     - When the last story is reached, navigation returns the user to the feed.
   - Data:
     - Stories come from Convex (stories.get and stories.listUserStories).
     - Stories track viewCount; allViewed logic influences which story is treated as the “current” one.

4) Profile page - public developer profile and repo connections
   - URL pattern: ${baseUrl}/profile/[username]
   - Example: ${baseUrl}/profile/example-username
   - Purpose:
     - Provide a public profile page for each developer using ghstories.
     - Let users manage which repositories are connected, view highlights, and see simple insights.
   - Sections:
     - Header:
       - Avatar, display name, username (e.g. @username).
       - Follow / Unfollow button for visitors, backed by Convex follow/unfollow mutations.
     - Repositories (own profile only):
       - Lists currently connected repositories with links to each GitHub repo.
       - Allows connecting new repos via GitHub OAuth to set up webhooks automatically.
       - Allows disconnecting repos to stop sending commits to ghstories.
     - Highlights:
       - Grid of saved highlight stories, each with commit message excerpt, view count, and a pin icon.
       - Clicking a highlight opens the Story Viewer for that story.
       - Users can toggle highlight status on their own stories.
     - Insights (own profile only):
       - Simple analytics cards showing total highlight views, number of highlights, and average views per highlight.
   - Behavior:
     - Uses Convex actions to list available GitHub repos and create/delete webhooks.
     - Uses Convex queries and mutations to manage follows, highlights, and connected repos.

5) Authentication and GitHub integration
   - ghstories uses GitHub OAuth to sign in users.
   - After authentication:
     - The app retrieves a GitHub access token via better-auth and authClient.
     - Convex actions (github.listReposForConnect, github.createWebhook, github.deleteWebhook) use this token.
   - Webhooks:
     - Connected repositories are configured so that new commits trigger a webhook to ghstories.
     - Webhook handlers (under /api/webhooks/github) transform commit payloads into ghstories stories.

6) Following and feed construction
   - ghstories mirrors your GitHub following graph using scheduled and manual sync:
     - A cron job under /api/cron/sync-github-following keeps follow data fresh.
     - There is also a manual sync endpoint under /api/sync-github-following.
   - Feed logic:
     - Stories.listFeed returns stories from:
       - People you follow.
       - Yourself.
     - Stories.listMyStories returns your own stories, used for empty state copy and personal views.

7) Story lifecycle
   - Every new commit on a connected repo becomes a "story".
   - Stories are time-ordered per user; the viewer navigates oldest-to-newest.
   - Stories are ephemeral by design (24h expiry), though highlights persist on the profile.
   - Each story tracks:
     - userId
     - commit metadata (message, repository name)
     - createdAt timestamp
     - viewCount for read/unread behavior and insights.

8) LLM-specific context
   - ghstories domain: ${baseUrl}
   - Key navigation URLs:
     - Landing: ${baseUrl}/
     - Feed: ${baseUrl}/feed
     - Story (example): ${baseUrl}/stories/example-story-id
     - Profile (example): ${baseUrl}/profile/example-username
   - This /llms.txt endpoint exists specifically to describe:
     - The product purpose and target users (developers using GitHub).
     - How stories are created from commits and how they expire.
     - How following, highlights, profiles, and the feed interact.
     - The high-level architecture using Next.js App Router, Convex for backend logic, and GitHub OAuth + webhooks.
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
