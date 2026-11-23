# Chess and Cribbage website and tablet evidence

Published context: November 23, 2026, America/Chicago. This is the owner's specific authorization for two product listings and one development diary; the existing daily draft queue and previous stories retain their dates and contents.

## Actual private builds

The Samsung Yota4 (SM-X920) was the only connected test device. The phone was not used. Chess and Cribbage were absent from this tablet and were installed once; the unrelated Shredder Chess app was left alone. Palace was updated in place from build 36 to build 39. No uninstall, data clear, sign-out, account creation or provider changes occurred.

| Product | Installed version | APK SHA256 | Observed scope |
| --- | --- | --- | --- |
| Chess | 0.2.0 / 2 | de0392eaee46fbd6ded8bd67d28a3f771e3612950164fa622110a9d694d450df | Real local computer setup; ordinary e2-e4 taps; computer replied Nc6; clocks and move list visible |
| Cribbage | 0.2.0 / 2 | cc29997d25dbbf97f65324ac91472aa065257108211e67ecbb02fdcf31946538 | Standard local game; six-card deal; two-card discard and confirmation; human 4C, computer 7H, human 4H; fifteen scored two; computer QH took the count to 25 |
| Palace | 0.1.13 / 39 | 2b48805f15464b243c2557451af9cb9735d4fbb51d9e682c2bf38c49a95c0917 | Same-package/signer update; installed APK read-back matched; original first-install timestamp retained |

Each installed APK was pulled back and hashed. The test builds use the existing private QA signer. This is not production signing or a store release. Chess's subsequent connected-account source work was not compiled into the verified build and is not presented as installed.

Additional tablet checks: Chess returned from background with the same e4/Nc6 position and paused practice clock. Cribbage recovered the same paused hand, 2–0 score, remaining cards and count after a forced process stop/reopen; subsequent thirty-one scoring was exercised. Its Ranked entry opened an email/Google chooser with an explicit account-service-not-connected notice; no identity was selected. Palace launched without detected startup errors, and its account panel exposed Google, email, email creation/recovery and offline entry. No Apple or Facebook choice was present. This proves the installed controls, not successful fresh-user authentication.

Fresh-user Google/email acceptance, recovery mail, real human online games, public ranked readback and complete tablet game acceptance remain unverified. A visible account or Ranked button is not evidence those integrations work. No public binary links or playable Chess/Cribbage web games are added.

## Artwork and screenshots

The Chess tile is the current original v2 product artwork from the verified game project. Cribbage uses the current original illustrated launcher derivative. The screenshots were captured directly from the installed guest/offline tablet apps on the publication day. No player photos or private account information appear. Full image hashes and provenance are in `assets/chess-cribbage/provenance.json`.

The chess pieces visible in gameplay captures are by Cburnett under the BSD 3-Clause license selected by the game project. The attribution and license notice is retained at `assets/chess-cribbage/chess-pieces-notice.txt` and linked from the Chess page. The illustrations are not labeled gameplay captures, and the screenshots are not playable controls.

## Website integration

Canonical product routes are `chess.html` and `cribbage.html`. Shared catalog records populate the tile-first homepage, Games showcase, product navigation, footer, related products, generated product journals and sitemap. The Games hub adds a clearly labeled new-at-the-table section without altering its existing seven-game card collection or Palace demo.

The single new developer diary is `news-chess-cribbage-and-the-fine-art-of-looking-thoughtful.html`. It links both product pages and uses a genuine Cribbage tablet capture. All 78 prior article records are preserved, apart from transferring the featured flag to the new story. The existing unqueued GildenSpire draft remains private and unchanged. No scheduled publishing settings are modified.

Local verification passed: static validation of 181 pages; 18 rendered cases across 320, 390 and 1440 pixel widths, including game-page galleries, catalog/home/footer links, newest-news visibility, image loading, overflow and no-JavaScript navigation; Palace fixed-deal/replay/save/conservation checks and all nine existing browser regression groups. Screenshots and exact installed-build receipts remain in the private test evidence. Public pages contain no private APK links.
