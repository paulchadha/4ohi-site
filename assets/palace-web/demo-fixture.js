// Explicit public demo allocation. Deck draws from the end, as in the native engine.
export const fixtureData = {
  "id": "palace-web-demo-v1",
  "rules": {
    "twosReset": true,
    "tensBurn": true,
    "fourOfKindBurns": true,
    "sevensLow": true,
    "eightsInvisible": true,
    "multiPlaySameRank": true,
    "jumpInFourOfKind": true,
    "quickDrawMatch": true,
    "humanFirstOutEndsBots": true,
    "botLoopProtection": true,
    "jokers": false,
    "jokerMode": "2",
    "handSize": 3,
    "faceUpCount": 3,
    "faceDownCount": 3
  },
  "initial": {
    "id": "palace-web-demo-v1",
    "revision": 0,
    "updatedAt": 0,
    "players": [
      {
        "id": "human",
        "botId": null,
        "name": "You",
        "avatar": "🙂",
        "personality": "human",
        "tempoProfile": "human",
        "bot": false,
        "out": false,
        "hand": [
          {
            "id": "3-diamonds",
            "rank": "3",
            "suit": "diamonds"
          },
          {
            "id": "K-hearts",
            "rank": "K",
            "suit": "hearts"
          },
          {
            "id": "8-spades",
            "rank": "8",
            "suit": "spades"
          }
        ],
        "faceUp": [
          {
            "id": "9-diamonds",
            "rank": "9",
            "suit": "diamonds"
          },
          {
            "id": "Q-diamonds",
            "rank": "Q",
            "suit": "diamonds"
          },
          {
            "id": "A-hearts",
            "rank": "A",
            "suit": "hearts"
          }
        ],
        "faceDown": [
          {
            "id": "6-spades",
            "rank": "6",
            "suit": "spades"
          },
          {
            "id": "4-spades",
            "rank": "4",
            "suit": "spades"
          },
          {
            "id": "5-diamonds",
            "rank": "5",
            "suit": "diamonds"
          }
        ]
      },
      {
        "id": "omar",
        "botId": "omar",
        "name": "Oner",
        "avatar": "👨🏾‍💻",
        "gender": "man",
        "personality": "sharp",
        "tempoProfile": "variable",
        "bot": true,
        "out": false,
        "hand": [
          {
            "id": "6-hearts",
            "rank": "6",
            "suit": "hearts"
          },
          {
            "id": "6-diamonds",
            "rank": "6",
            "suit": "diamonds"
          },
          {
            "id": "7-spades",
            "rank": "7",
            "suit": "spades"
          }
        ],
        "faceUp": [
          {
            "id": "9-spades",
            "rank": "9",
            "suit": "spades"
          },
          {
            "id": "J-hearts",
            "rank": "J",
            "suit": "hearts"
          },
          {
            "id": "J-spades",
            "rank": "J",
            "suit": "spades"
          }
        ],
        "faceDown": [
          {
            "id": "10-spades",
            "rank": "10",
            "suit": "spades"
          },
          {
            "id": "5-clubs",
            "rank": "5",
            "suit": "clubs"
          },
          {
            "id": "4-diamonds",
            "rank": "4",
            "suit": "diamonds"
          }
        ]
      }
    ],
    "deck": [
      {
        "id": "J-diamonds",
        "rank": "J",
        "suit": "diamonds"
      },
      {
        "id": "8-hearts",
        "rank": "8",
        "suit": "hearts"
      },
      {
        "id": "5-hearts",
        "rank": "5",
        "suit": "hearts"
      },
      {
        "id": "8-diamonds",
        "rank": "8",
        "suit": "diamonds"
      },
      {
        "id": "4-clubs",
        "rank": "4",
        "suit": "clubs"
      },
      {
        "id": "8-clubs",
        "rank": "8",
        "suit": "clubs"
      },
      {
        "id": "A-diamonds",
        "rank": "A",
        "suit": "diamonds"
      },
      {
        "id": "2-clubs",
        "rank": "2",
        "suit": "clubs"
      },
      {
        "id": "6-clubs",
        "rank": "6",
        "suit": "clubs"
      },
      {
        "id": "10-clubs",
        "rank": "10",
        "suit": "clubs"
      },
      {
        "id": "9-clubs",
        "rank": "9",
        "suit": "clubs"
      },
      {
        "id": "2-spades",
        "rank": "2",
        "suit": "spades"
      },
      {
        "id": "2-hearts",
        "rank": "2",
        "suit": "hearts"
      },
      {
        "id": "J-clubs",
        "rank": "J",
        "suit": "clubs"
      },
      {
        "id": "K-diamonds",
        "rank": "K",
        "suit": "diamonds"
      },
      {
        "id": "2-diamonds",
        "rank": "2",
        "suit": "diamonds"
      },
      {
        "id": "K-spades",
        "rank": "K",
        "suit": "spades"
      },
      {
        "id": "5-spades",
        "rank": "5",
        "suit": "spades"
      },
      {
        "id": "A-clubs",
        "rank": "A",
        "suit": "clubs"
      },
      {
        "id": "7-diamonds",
        "rank": "7",
        "suit": "diamonds"
      },
      {
        "id": "3-clubs",
        "rank": "3",
        "suit": "clubs"
      },
      {
        "id": "3-hearts",
        "rank": "3",
        "suit": "hearts"
      },
      {
        "id": "Q-spades",
        "rank": "Q",
        "suit": "spades"
      },
      {
        "id": "9-hearts",
        "rank": "9",
        "suit": "hearts"
      },
      {
        "id": "Q-clubs",
        "rank": "Q",
        "suit": "clubs"
      },
      {
        "id": "A-spades",
        "rank": "A",
        "suit": "spades"
      },
      {
        "id": "10-diamonds",
        "rank": "10",
        "suit": "diamonds"
      },
      {
        "id": "10-hearts",
        "rank": "10",
        "suit": "hearts"
      },
      {
        "id": "4-hearts",
        "rank": "4",
        "suit": "hearts"
      },
      {
        "id": "7-clubs",
        "rank": "7",
        "suit": "clubs"
      },
      {
        "id": "7-hearts",
        "rank": "7",
        "suit": "hearts"
      },
      {
        "id": "K-clubs",
        "rank": "K",
        "suit": "clubs"
      },
      {
        "id": "3-spades",
        "rank": "3",
        "suit": "spades"
      },
      {
        "id": "Q-hearts",
        "rank": "Q",
        "suit": "hearts"
      }
    ],
    "pile": [],
    "currentPlayer": 0,
    "winnerIndex": null,
    "loserIndex": null,
    "safeOrder": [],
    "lastPlay": null,
    "quickMatchRank": null,
    "jumpInWindow": null,
    "botStrategyMemory": [],
    "botTurnCount": 0,
    "setupReady": [
      false,
      true
    ],
    "setupStartedAt": 0,
    "setupDeadlineAt": null,
    "log": [
      "Swap your hand cards with your top row, then start the hand."
    ],
    "status": "setup",
    "message": "Swap your hand cards with your top row, then start the hand."
  }
};
