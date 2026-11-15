# Palace background refresh — November 15, 2026

The public Palace board refreshes at the existing five-second cadence without inserting an updating banner, changing the refresh button label, marking accepted standings busy or recreating unchanged row nodes. Accepted rows, empty-result messages, timestamps and champion text remain stable while another request is pending. A successful response updates the accepted snapshot; an unchanged set of rows keeps its DOM nodes.

Initial loading remains explicit. A failed request still reports an accessible error or stale-data warning, and a retry retains that warning and the old timestamp until a valid response arrives. Overlapping requests coalesce. Cached browser navigation resumes the last validated in-memory board while rechecking it; disposed requests cannot overwrite the new reader. No standings are invented or persisted in local storage.

The homepage's primary button opens the public Palace leaderboard directly, with a separate All leaderboards button retaining access to the existing hub. The tile grid, games and apps links remain. This additional link change was explicitly requested by the owner during the refresh work.

The endpoint, data validation, public-only request options, refresh cadence, privacy policy, credentials, permissions and services are unchanged. This is a focused website presentation change. It publishes no news, changes no article and consumes no draft. Other app pages and unrelated worktrees are protected separately. A pre-existing full-build cache-key drift in the latest Sling article is excluded by retaining that article's exact baseline output.

Validation covers reader state, repeated/slow refreshes, stable text and document geometry, retained row identities, stale and empty states, retry, hidden-page pause, canceled responses, cached and real navigation, initial failures, private payload rejection, and desktop/mobile layouts. Browser failure/slow cases use isolated API responses; they create no production data. Live deployment and actual-service smoke evidence is recorded separately from those fixtures.
