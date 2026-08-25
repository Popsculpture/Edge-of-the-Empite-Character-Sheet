window.SW = window.SW || {};
// Force powers, read from the printed trees. Box 0 of links is the basic
// power; the rest index into cells. An upgrade may only be bought if it
// links to the basic power or to an upgrade already owned.
window.SW.forcePowers = [
  {
    "key": "fp_alter",
    "name": "Alter",
    "prereqRating": 1,
    "source": "Unlimited Power 42",
    "page": 174,
    "baseXp": 15,
    "baseText": "The Force user can tap into the Living Force of their surroundings, manipulating the nearby environs. The Force user may spend [FORCE] to make all terrain currently withing short range difficulty terrain until the end of their next turn. The Force user may spend [FORCE] to make all terrain currently withing short range normal terrain until the end of their next turn.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Spend [FORCE] and make an Average (dd ) Survival check to instantly discover food, water, or other critical supplies withing extreme range."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "The Force user may spend [FORCE] to give all characters within short range of the user concealment adding b or b to appropriate checks."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE] to share the senses of animals within range of this power, adding b to Perception and Vigilance checks, and gaining other benefits."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "The power can affect firm terrain, such as packed earth, stone, or ice."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Duration",
        "xp": 10,
        "text": "Commit [FORCE] after successfully activating the power to sustain its effects while the user remains within rage of the affected area."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to allow a number of targets equal to the number of Strength upgrades to ignore this power's effects."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to make a small patch of terrain within the affected area impassable."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] to allow a number of targets equal to the number of Strength upgrades to ignore this power's effects."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to create a corrosive atmosphere in a small area (up to 3m across) within the affected area."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 20,
        "text": "Spend [FORCE] [FORCE] to upgrade the difficulty of all checks made by opponents while in the power's area of effect once."
      },
      {
        "row": 3,
        "col": 1,
        "span": 2,
        "name": "Mastery",
        "xp": 25,
        "text": "When the user activates this power without spending [FORCE] generated from z results, add Z to all other Force power checks made within this power's area of effect. When the user activates this power without spending [FORCE] generated from Z results, add z to all other Force power checks made within this power's area of effect."
      },
      {
        "row": 3,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] to allow a number of targets equal to the number of Strength upgrades to ignore this power's effects."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        3,
        6
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ],
      [
        5,
        9
      ],
      [
        6,
        10
      ],
      [
        7,
        11
      ],
      [
        8,
        9
      ],
      [
        8,
        12
      ],
      [
        9,
        13
      ],
      [
        10,
        13
      ],
      [
        11,
        14
      ],
      [
        13,
        14
      ]
    ]
  },
  {
    "key": "fp_battle_meditation",
    "name": "Battle Meditation",
    "prereqRating": 2,
    "source": "Force and Destiny core 284",
    "page": 175,
    "baseXp": 15,
    "baseText": "The Force user directs allies in battle, making them more effective as a coordinated unit. The user may spend [FORCE] to add one automatic s to all checks made by a number of engaged friendly targets up to his Presence before the end of turn. If the user used any z to generate [FORCE], reduce each target's Willpower by 1 (to a minimum of 1) until the end of the encounter.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to affect a number of additional targets equal to Presence per rank of Magnitude purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "When making a Battle Meditation power check, the user may make an Easy (d ) Leadership check as part of the pool. If the user is able to activate the power and succeeds on the check, he may send simple orders as part of the power."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to affect a number of additional targets equal to Presence per rank of Magnitude purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 2,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to add one additional automatic s to affected characters' checks."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 15,
        "text": "Spend [FORCE] to affect a number of additional targets equal to Presence per rank of Magnitude purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 2,
        "name": "Duration",
        "xp": 25,
        "text": "Commit [FORCE] [FORCE] [FORCE] to sustain the ongoing effects of the power on each affected target while it remains in range."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 20,
        "text": "Spend [FORCE] to affect a number of additional targets equal to Presence per rank of Magnitude purchased."
      },
      {
        "row": 3,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 20,
        "text": "May suffer 4 strain to change the range of power and range upgrades to planetary scale."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Mastery",
        "xp": 25,
        "text": "If no z was used to generate [FORCE], choose one skill. While affected bu the power, each affected character counts as having the same number of ranks in the chosen skill as the affected character with the most ranks in the skill. If the user used any z to generate [FORCE], each affected character must make an Easy (d ) Discipline check if he wishes to resist obeying orders."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        4
      ],
      [
        2,
        3
      ],
      [
        2,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        5
      ],
      [
        4,
        7
      ],
      [
        5,
        8
      ],
      [
        6,
        9
      ],
      [
        7,
        10
      ],
      [
        8,
        9
      ],
      [
        8,
        11
      ],
      [
        11,
        12
      ]
    ]
  },
  {
    "key": "fp_bind",
    "name": "Bind",
    "prereqRating": 2,
    "source": "Force and Destiny core 286",
    "page": 176,
    "baseXp": 15,
    "baseText": "The Force user restrains an enemy, preventing the target from acting. The user may spend [FORCE] to immobilize a target within short range until the end of the user's next turn. If the user used any z to generate [FORCE], the target also suffers 1 wound per [FORCE] spent on the check (ignoring soak).",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to Disorient the target for a number of rounds equal to Strength upgrades purchased."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE], whenever a target affected by Bind takes an action, that target suffers strain equal to user's Willpower"
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 20,
        "text": "Spend [FORCE] [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] to Disorient the target for a number of rounds equal to Strength upgrades purchased."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Commit [FORCE] [FORCE] [FORCE] to sustain the ongoing effects of the power on each affected target."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE] to move the target one range band closer or farther away."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 25,
        "text": "Spend [FORCE] [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 2,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] to Disorient the target for a number of rounds equal to Strength upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 20,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 3,
        "col": 1,
        "span": 3,
        "name": "Mastery",
        "xp": 20,
        "text": "When the user is making a Bind power check, if the check was not already opposed, the user may roll an opposed Discipline vs. Discipline check against one target of the power. If no z were used to generate [FORCE] and the user succeeds on the check, he may immediately stagger the target until the end of his next turn. If any z were used to generate [FORCE] and the check succeeds, the target suffers a Critical Injury, adding +10 to the roll per [FORCE] spent on the check."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        6
      ],
      [
        3,
        7
      ],
      [
        5,
        9
      ],
      [
        6,
        10
      ],
      [
        7,
        8
      ],
      [
        8,
        11
      ],
      [
        9,
        12
      ],
      [
        10,
        13
      ],
      [
        11,
        13
      ],
      [
        12,
        13
      ]
    ]
  },
  {
    "key": "fp_conjure",
    "name": "Conjure",
    "prereqRating": 1,
    "source": "Unlimited Power 40",
    "page": 177,
    "baseXp": 20,
    "baseText": "The Force user calls forth a spectral object to their hand, which lasts for a short time The user may spend [FORCE] to create a facsimile of a Brawl or Melee weapon anywhere within engaged range. At the end of the user's next turn, this item dissipates. At the GM's discretion, the user can instead conjure a simple tool or other useful low-tech item with an encumbrance no greater than 1.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Commit [FORCE] to sustain 1 conjuration per Duration upgrade purchased, while it remains at medium range."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Number",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to create additional identical conjurations equal to ranks in Number upgrades purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to increase the maximum encumbrance of the facsimile that can be conjured by 2 per Magnitude upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "span": 2,
        "name": "Magnitude",
        "xp": 20,
        "text": "Spend [FORCE] to increase the maximum encumbrance of the facsimile that can be conjured by 2 per Magnitude upgrade purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE] to add 1 of the following weapon qualities to the conjuration: Defensive 1, Deflection 1, Stun 4."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Commit [FORCE] to sustain 1 conjuration per Duration upgrade purchased, while it remains at medium range."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Number",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to create additional identical conjurations equal to ranks in Number upgrades purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Spend [FORCE] to add 1 of the following weapon qualities to the conjuration: Burn 3, Pierce 3, Vicious 3."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 20,
        "text": "Spend [FORCE] to increase the range at which the facsimile can be conjured and sustained by 1 (to a maximum of extreme)."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Commit [FORCE] to sustain 1 conjuration per Duration upgrade purchased, while it remains at medium range."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Mastery",
        "xp": 20,
        "text": "Spend [FORCE] [FORCE] [FORCE] to summon the facsimile of a creature of silhouette 1 or smaller instead of an object. This creature is bound to the user's will, and mindlessly follows that character's commands until the end of the Force user's next turn. If the user has the corpse of the creature being conjured to imbue with false life, this facsimile lasts until the end of the encounter instead, but the user gains 7 conflict for doing so."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        7
      ],
      [
        4,
        8
      ],
      [
        5,
        6
      ],
      [
        5,
        9
      ],
      [
        7,
        8
      ],
      [
        7,
        11
      ],
      [
        8,
        9
      ],
      [
        9,
        10
      ]
    ]
  },
  {
    "key": "fp_ebb_flow",
    "name": "Ebb/Flow",
    "prereqRating": 1,
    "source": "Disciples of Harmony 38",
    "page": 178,
    "baseXp": 10,
    "baseText": "The Force user's actions empower himself or sap strength from this foes. Ebb: When the Force user makes a skill check, he may roll an Ebb power check as part of roll. The user may spend [FORCE] to suffer 1 strain, then inflict 1 strain on all other engaged characters. The Force user may not activate this multiple times. Flow: When the Force user makes a skill check, he may roll a Flow power check as part of the roll. The user may spend [FORCE] to heal 1 strain. The Force user may not activate this multiple times.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to exclude number of targets equal to Magnitude upgrades purchased from being affected."
      },
      {
        "row": 0,
        "col": 1,
        "span": 2,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to affect all other characters at short range."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "The Force user may spend [FORCE] to increase the strain healed or inflicted by 1."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] [FORCE] once per encounter to ask the GM a single yes/no question."
      },
      {
        "row": 1,
        "col": 1,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ebb: When making a combined Ebb power check may spend [FORCE] to add t to any checks made by the engaged opponents until next turn. Flow: When making a combined Flow power check may spend [FORCE] to add a to any checks using the same skill until the end of next turn."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "The Force user may spend [FORCE] to increase the t or a added by 1."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to exclude number of targets equal to Magnitude upgrades purchased from being affected."
      },
      {
        "row": 2,
        "col": 1,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ebb: When making a combined Ebb power check may spend [FORCE] to add f to any checks made by the engaged opponents until next turn. Flow: When making a combined Flow power check may spend [FORCE] to add s to any checks using the same skill until the end of next turn."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "The Force user may spend [FORCE] to increase the s or f added by 1."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Commit [FORCE] until the end of the current encounter. For the remainder of the current encounter, add [FORCE] to all skill checks. Each Z and z adds either s or a to the check; each z causes the user to suffer 1 strain and gain 1 conflict."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 20,
        "text": "Ebb: Once per session, if a target suffered at least 5 strain from this power, add y to the target's next check. Flow: Once per session, if the user healed at least 5 strain from this power, add x to user's next check."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        4,
        5
      ],
      [
        4,
        7
      ],
      [
        5,
        6
      ],
      [
        5,
        8
      ],
      [
        7,
        8
      ],
      [
        8,
        9
      ],
      [
        8,
        10
      ],
      [
        8,
        11
      ]
    ]
  },
  {
    "key": "fp_endure",
    "name": "Endure",
    "prereqRating": 1,
    "source": "Knights of Fate 36",
    "page": 179,
    "baseXp": 10,
    "baseText": "When the character suffers a Critical Injury with a severity no greater than Easy (d ) the character may activate Endure as an out-of-turn incidental and commit [FORCE] to temporarily ignore the effects of that injury. The character does not apply any results from the Critical Injury or add +10 to further rolls on the Critical Injury Result table while [FORCE] remains committed. When this ongoing effect ends, the character suffers all effects of the Critical Injury (unless it has been treated).",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Increase the severity of Critical Injury that can be affected by one per Strength upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "The character can commit one additional [FORCE] to temporarily ignore one additional Critical Injury per Control upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Duration",
        "xp": 10,
        "text": "As an incidental, the character can activate Endure to temporarily ignore a Critical Injury the character is already suffering, and which is of a severity that Endure could affect normally."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "The character can commit one additional [FORCE] to temporarily ignore one additional Critical Injury per Control upgrade purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Increase the severity of Critical Injury that can be affected by one per Strength upgrade purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 2,
        "name": "Magnitude",
        "xp": 10,
        "text": "The character can use Endure to affect allies at short range. The ongoing effect ends if the distance between the characters increases beyond short for any reason."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Increase the severity of Critical Injury that can be affected by one per Strength upgrade purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "The character can commit one additional [FORCE] to temporarily ignore one additional Critical Injury per Control upgrade purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Increase the severity of Critical Injury that can be affected by one per Strength upgrade purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "The character can use Endure to affect allies within medium range. The ongoing effect ends if the distance between the characters increases beyond medium for any reason."
      },
      {
        "row": 3,
        "col": 1,
        "span": 2,
        "name": "Mastery",
        "xp": 20,
        "text": "When activating Endure. the character may make an Endure power check, making a Discipline check with a difficulty equal to the severity of the Critical Injury and adding [FORCE] up the character's Force rating. If the character succeeds on the check and generates [FORCE] equal to the Severity of the Critical Injury, the Critical Injury is not suffered."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        2,
        5
      ],
      [
        4,
        5
      ],
      [
        4,
        7
      ],
      [
        5,
        6
      ],
      [
        6,
        10
      ],
      [
        7,
        8
      ],
      [
        8,
        9
      ],
      [
        9,
        11
      ]
    ]
  },
  {
    "key": "fp_enhance",
    "name": "Enhance",
    "prereqRating": 1,
    "source": "Age of Rebellion core 298, Force and Destiny core 288",
    "page": 180,
    "baseXp": 10,
    "baseText": "When making an Athletics check, the Force user may roll an Enhance power check as part of the pool. The user may spend [FORCE] to gain s or a (user's choice) on the check.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Enhance may be used with the Coordination skill."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Enhance may be used with the Resilience skill."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Take a Force Leap action: make a Enhance power check. The user may spend [FORCE] to jump horizontally to any location in short range."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Enhance may be used with the Piloting (Planetary) skill."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Enhance may be used with the Brawl skill."
      },
      {
        "row": 1,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "When performing Force Leap, the user can jump vertically in addition to jumping horizontally."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Enhance may be used with the Piloting (Space) skill."
      },
      {
        "row": 2,
        "col": 1,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ongoing effect: Commit [FORCE]. The user increases his Brawn characteristic by 1 (to a maximum of 6)."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase Force Leap range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ongoing effect: Commit [FORCE]. The user increases his Agility characteristic by 1 (to a maximum of 6)."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "The user can perform a Force Leap as a maneuver instead of action."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        7
      ],
      [
        5,
        8
      ],
      [
        6,
        9
      ],
      [
        7,
        10
      ],
      [
        9,
        11
      ]
    ]
  },
  {
    "key": "fp_farsight",
    "name": "Farsight",
    "prereqRating": 1,
    "source": "Savage Spirits 36",
    "page": 181,
    "baseXp": 5,
    "baseText": "The Force user expands normal visual senses through a connection to the Force. The user may spend [FORCE] to ignore the effects of darkness or blindness and see normally at up to medium range for the remainder of the round (or one minute). This allows the user to view everything most sentients could normally be able to see on a well lit day.",
    "rows": 3,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Spend [FORCE] to see microscopic details of a single object within engaged range."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Spend [FORCE] to see through a single object at a medium range."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Spend [FORCE] to make out fine details on a single object within medium range."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase duration by number of rounds (or minutes) equal to Duration upgrades purchased."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by one range band equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase duration by number of rounds (or minutes) equal to Duration upgrades purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "When making a Vigilance or Perception check, make a Farsight power check as part of the pool and spend [FORCE] to gain s or a on the check."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by one range band equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "This power gains the ongoing effect: Commit [FORCE] after successfully activating the Farsight power to increase ranks in Perception by 1."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to see in every direction simultaneously, noticing and observing things in a full 360-degree arc."
      },
      {
        "row": 2,
        "col": 2,
        "span": 2,
        "name": "Mastery",
        "xp": 20,
        "text": "Spend [FORCE] [FORCE]. The user now can see as through from a spot within close range (planetary scale) of the user's body."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        3
      ],
      [
        1,
        5
      ],
      [
        2,
        3
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        7
      ],
      [
        6,
        7
      ],
      [
        6,
        10
      ],
      [
        7,
        8
      ],
      [
        7,
        11
      ],
      [
        8,
        11
      ],
      [
        9,
        10
      ],
      [
        10,
        11
      ]
    ]
  },
  {
    "key": "fp_foresee",
    "name": "Foresee",
    "prereqRating": 1,
    "source": "Age of Rebellion core 300, Force and Destiny core 290",
    "page": 182,
    "baseXp": 10,
    "baseText": "The Force user can feel the Force flowing around everything, seeing what is and what will be. The user may spend [FORCE] to gain vague hints of events to come, up to a day into his future.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 3,
        "name": "Control",
        "xp": 10,
        "text": "When making a skill check to determine initiative, the Force user may roll a Foresee power check as part of the pool. He may spend [FORCE] to gain s on the check."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to pick out specific details equal to Strength upgrades purchased."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to affect a number of targets equal to Magnitude upgrades purchased within engaged range."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase the range to affect additional targets by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Affected targets increase their ranged and Melee defense by 2 for the first round of combat."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase the number of days into the future the user can see equal to Duration upgrades purchased."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to affect a number of targets equal to Magnitude upgrades purchased within engaged range."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase the range to affect additional targets by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase the range to affect additional targets by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to pick out specific details equal to Strength upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 3,
        "name": "Control",
        "xp": 15,
        "text": "When performing a Foresee power check as part of an initiative check, the Force user may spend [FORCE] to allow all affected targets to take one free maneuver before the first round of combat begins."
      },
      {
        "row": 3,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase the number of days into the future the user can see equal to Duration upgrades purchased."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        3
      ],
      [
        1,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        6
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ],
      [
        6,
        10
      ],
      [
        7,
        11
      ],
      [
        8,
        9
      ],
      [
        9,
        11
      ],
      [
        10,
        12
      ]
    ]
  },
  {
    "key": "fp_heal_harm",
    "name": "Heal/Harm",
    "prereqRating": 1,
    "source": "Force and Destiny core 292",
    "page": 183,
    "baseXp": 15,
    "baseText": "The Force user bolsters his ally with renewed vigor, or saps his foe of vital energy. Heal (Light side Force user only): Spend [FORCE] to heal a number of wounds equal to Intellect from an engaged living creature (including user). Harm: Spend [FORCE] to inflict a number of wounds equal to Intellect (Ignoring soak) on an engaged living target. The user gains 1 Conflict.",
    "rows": 3,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 20,
        "text": "Heal: If no z generated [FORCE] target heals strain equal to wounds healed. Harm: If any z were used to generate [FORCE] user heals strain equal to wounds inflicted."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 20,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Heal: Spend [FORCE] to increase wounds healed by 1 per rank of Strength upgrades purchased. Harm: Spend [FORCE] in increase wounds inflicted by 1 per rank of Strength upgrades purchased."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 20,
        "text": "Heal: Spend [FORCE] to remove one status effect from target. Harm: The user may spend [FORCE] to heal wounds equal to wounds inflicted on target. Healed character gains 1 Conflict."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 20,
        "text": "Heal: Heal additional wounds equal to ranks in Medicine. Harm: Inflict additional wounds equal to ranks in Medicine."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 20,
        "text": "Heal: May make a Heal power check combined with a Hard (ddd ) Medicine check. If check succeeds, one target who heals wounds also heals one Critical Injury. Harm: May make a Harm power check combined with a Hard (ddd ) Medicine vs. Resilience check. If check succeeds, one target who suffers wounds also suffers one Critical Injury (adding +10 to the roll per aa)."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Mastery",
        "xp": 20,
        "text": "Heal: Once per session, spend [FORCE] [FORCE] [FORCE] [FORCE] to restore 1 target who died after end of user's last turn to life. Harm: Once per session, when this power kills a target, may restore one engaged character who dies this encounter to life. Each character gains 7 conflict."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Heal: Spend [FORCE] to increase wounds healed by 1 per rank of Strength upgrades purchased. Harm: Spend [FORCE] in increase wounds inflicted by 1 per rank of Strength upgrades purchased."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        6
      ],
      [
        4,
        8
      ],
      [
        5,
        6
      ],
      [
        5,
        9
      ],
      [
        6,
        7
      ],
      [
        6,
        10
      ],
      [
        7,
        8
      ],
      [
        7,
        11
      ],
      [
        8,
        12
      ],
      [
        11,
        12
      ]
    ]
  },
  {
    "key": "fp_imbue",
    "name": "Imbue",
    "prereqRating": 2,
    "source": "Disciples of Harmony 36",
    "page": 184,
    "baseXp": 15,
    "baseText": "The Force user lends strength to allies, making them more potent, resourceful, or resilient for a time. The user may spend [FORCE] [FORCE] to increase one of another engaged character's characteristics by 1 (to a maximum of 6) until the end of the Force user's next turn. This can only be used once per character per encounter. If the user uses z to generate [FORCE], the target increases a second characteristic by 1 (to a maximum of 6) until the end of the user's next turn, but both the Force user and target suffer 3 strain.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 2,
        "name": "Strength",
        "xp": 5,
        "text": "If no z were used to generate [FORCE] decrease all Critical Injuries suffered and inflicted by the target by 10 per Strength upgrade purchased. If no Z were used to generate [FORCE] increase all Critical Injuries suffered and inflicted by 10 per Strength upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend [FORCE] to allow the target to count as having ranks in a skill equal to user's ranks in the skill."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 0,
        "span": 2,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 2,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 0,
        "span": 2,
        "name": "Strength",
        "xp": 10,
        "text": "If no z were used to generate [FORCE] decrease all Critical Injuries suffered and inflicted by the target by 10 per Strength upgrade purchased. If no Z were used to generate [FORCE] increase all Critical Injuries suffered and inflicted by 10 per Strength upgrade purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Mastery",
        "xp": 25,
        "text": "Increase characteristics boosted by this power by 2 (to a maximum of 7) instead of 1 (to a maximum of 6)."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 10,
        "text": "Commit [FORCE] to sustain the effects of this power as long as the target remains in range."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 3,
        "col": 1,
        "span": 2,
        "name": "Strength",
        "xp": 20,
        "text": "If no z were used to generate [FORCE] decrease all Critical Injuries suffered and inflicted by the target by 10 per Strength upgrade purchased. If no Z were used to generate [FORCE] increase all Critical Injuries suffered and inflicted by 10 per Strength upgrade purchased."
      },
      {
        "row": 3,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 20,
        "text": "Commit [FORCE] to sustain the effects of this power as long as the target remains in range."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        4,
        6
      ],
      [
        5,
        8
      ],
      [
        6,
        9
      ],
      [
        7,
        10
      ],
      [
        8,
        11
      ],
      [
        9,
        10
      ]
    ]
  },
  {
    "key": "fp_influence",
    "name": "Influence",
    "prereqRating": 1,
    "source": "Edge of the Empire core 282, Force and Destiny core 294",
    "page": 185,
    "baseXp": 10,
    "baseText": "The character may attempt to guide, shape, and even twist the thoughts and feelings of others. Special Rule (Z/z use): When guiding and shaping thoughts, only [FORCE] generated from z may be used to generate negative emotions such as rage, fear, and hatred. Only [FORCE] generated from Z may be used to generate positive emotions such as peace, tranquility, and friendliness. Other emotions such as confusion can be created from [FORCE] generated from either Z or z. The character may spend [FORCE] to stress the mind of one living target he is engaged with, inflicting 1 strain.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "The Force user may make an opposed Discipline vs Discipline check combined with an Influence Power check. If the user spends [FORCE] and succeeds on the check, he can force the target to adopt an emotional state or believe something untrue, lasting for 1 round or 5 minutes."
      },
      {
        "row": 1,
        "col": 0,
        "span": 3,
        "name": "Control",
        "xp": 15,
        "text": "When making a Coercion, Charm, Deception, Leadership, or Negotiation check, the Force user may roll an Influence Power check as part of his dice pool. He may spend [FORCE] to gain s or a (user's choice) on the check."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "When stressing the mind of a target, the character inflicts 2 strain."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase duration by number of rounds (or minutes) equal to duration upgrades purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase duration by number of rounds (or minutes) equal to duration upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 3,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 3,
        "col": 2,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase duration by number of rounds (or minutes) equal to duration upgrades purchased."
      },
      {
        "row": 3,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Spend [FORCE] to increase duration by number of rounds (or minutes) equal to duration upgrades purchased."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        5
      ],
      [
        4,
        6
      ],
      [
        4,
        7
      ],
      [
        5,
        9
      ],
      [
        6,
        10
      ],
      [
        7,
        11
      ],
      [
        8,
        9
      ],
      [
        8,
        12
      ],
      [
        9,
        13
      ],
      [
        12,
        13
      ]
    ]
  },
  {
    "key": "fp_manipulate",
    "name": "Manipulate",
    "prereqRating": 1,
    "source": "Endless Vigil 36",
    "page": 186,
    "baseXp": 15,
    "baseText": "The Force user shapes machine components on a molecular level, allowing him to mend damaged mechanical systems. The Force user may spend [FORCE] to cause one vehicle or starship he is engaged with to recover on system strain. The user may activate this multiple times.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "Ongoing effect: Commit [FORCE]. One damaged weapon or item counts as being undamaged."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "When using this power, spend [FORCE] to cause targets to recover 1 additional strain or system strain, or heal 1 additional wound for every Strength upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ongoing effect: Commit [FORCE]. Increase the system strain threshold of 1 vehicle or starship at engaged range by 3 per [FORCE] committed."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "When making a Mechanics skill check, the user may roll a Manipulate power check as part of the pool and may spend [FORCE] to gain s or a on the check."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase the power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "The user may spend [FORCE] to heal a number of wounds equal to his Intellect in an engaged droid."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "When performing a combat check against a droid, ship vehicle or other mechanical construct within engaged range, the user may spend [FORCE] to inflict 1 additional strain or system strain on the target."
      },
      {
        "row": 2,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 15,
        "text": "Ongoing effect: Commit [FORCE]. Increase the hull trauma threshold of 1 vehicle or starship at engaged range by 3 per committed [FORCE]."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase the power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "When using this power, spend [FORCE] to cause targets to recover 1 additional strain or system strain, or heal 1 additional wound for every Strength upgrade purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Ongoing effect: Commit [FORCE]. Upgrade the ability of Computers and Mechanics checks once."
      },
      {
        "row": 3,
        "col": 1,
        "span": 1,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] to increase the power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Mastery",
        "xp": 20,
        "text": "When performing a Manipulate power check as part of a Mechanics skill check, the user may spend [FORCE] [FORCE] to gain x on the check."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        3
      ],
      [
        2,
        5
      ],
      [
        3,
        6
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ],
      [
        5,
        6
      ],
      [
        5,
        8
      ],
      [
        6,
        9
      ],
      [
        7,
        10
      ],
      [
        8,
        12
      ],
      [
        9,
        10
      ],
      [
        9,
        13
      ],
      [
        11,
        12
      ],
      [
        12,
        13
      ]
    ]
  },
  {
    "key": "fp_misdirect",
    "name": "Misdirect",
    "prereqRating": 1,
    "source": "Force and Destiny core 296",
    "page": 187,
    "baseXp": 15,
    "baseText": "The Force user creates illusions to fool those around him. The user may spend [FORCE] to make a target at up to short range unable to perceive a chosen person or object of silhouette 1 or smaller. Until the beginning of the user's next turn, the target cannot see or sense the hidden person or object.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Commit [FORCE] [FORCE] to sustain this power while the beguiled target remains in range."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] [FORCE] to increase the silhouette of the object obscured or illusion created by 1 per Strength upgrade purchased."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "The user may alter the perceived appearance of the chosen person or object instead of hiding it."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to affect additional targets equal to Presence per rank of Magnitude purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to affect additional targets equal to Presence per rank of Magnitude purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to increase the silhouette of the object obscured or illusion created by 1 per Strength upgrade purchased."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "May use this power to force the target to perceive a single illusory person or object."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Commit one or more [FORCE]. Add t per [FORCE] to all combat checks targeting the Force user."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to increase the silhouette of the object obscured or illusion created by 1 per Strength upgrade purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Mastery",
        "xp": 20,
        "text": "Spend [FORCE] [FORCE] to obscure additional object or create illusions equal to Cunning plus Deception."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] [FORCE] to increase the silhouette of the object obscured or illusion created by 1 per Strength upgrade purchased."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        4
      ],
      [
        1,
        2
      ],
      [
        1,
        5
      ],
      [
        2,
        3
      ],
      [
        2,
        6
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ],
      [
        5,
        9
      ],
      [
        6,
        10
      ],
      [
        7,
        8
      ],
      [
        7,
        11
      ],
      [
        9,
        10
      ],
      [
        9,
        13
      ],
      [
        11,
        12
      ],
      [
        11,
        14
      ]
    ]
  },
  {
    "key": "fp_move",
    "name": "Move",
    "prereqRating": 1,
    "source": "Age of Rebellion core 296, Edge of the Empire core 284, Force and Destiny core 298",
    "page": 188,
    "baseXp": 10,
    "baseText": "The Force user can move small objects via the power of the Force. The user may spend [FORCE] to move one object of silhouette 0 that is within short range up to his maximum range. The default maximum range is short range.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] to increase silhouette able to be targeted equal to strength upgrades purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] to increase silhouette able to be targeted equal to strength upgrades purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "The Force user can hurl objects to damage targets, by making a Discipline check (difficulty equal to the SIL of the object being thrown) combined with a Move Power check, dealing damage equal to 10 times silhouette (SIL 0 equals 5 damage)."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] to increase silhouette able to be targeted equal to strength upgrades purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 5,
        "text": "The Force user can pull objects out of secure mountings or out of an opponent's grasp."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 15,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 3,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 20,
        "text": "Spend [FORCE] to increase silhouette able to be targeted equal to strength upgrades purchased."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 15,
        "text": "The character can perform fine manipulation of items, allowing him to do whatever he would normally with his hands via this power at this power's range."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        6
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        8
      ],
      [
        6,
        9
      ],
      [
        7,
        10
      ],
      [
        7,
        11
      ],
      [
        8,
        12
      ],
      [
        9,
        13
      ],
      [
        10,
        14
      ],
      [
        11,
        14
      ]
    ]
  },
  {
    "key": "fp_protect_unleash",
    "name": "Protect/Unleash",
    "prereqRating": 3,
    "source": "Force and Destiny core 300",
    "page": 189,
    "baseXp": 20,
    "baseText": "The Force user guides the flow of energy, protecting himself and others or unleashing blasts of power upon his foes. Protect: The user makes a Protect power check and rolls Average (dd ) Discipline check as part of the pool. Spend [FORCE] [FORCE] to reduce damage from an energy-based weapon that this himself or an engaged character by amount equal to Willpower plus 1 per s. Dark side Force users may only protect themselves. Unleash: The user makes an Unleash power check as ranged attack and rolls an Average (dd ) Discipline check for difficulty. If check succeeds and spends [FORCE] [FORCE] the attack hits. It has a range of short, a base damage equal to Willpower, and a critical rating of 4. User gains 1 Conflict.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 0,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to decrease damage equal to ranks of Strength upgrades purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to decrease damage equal to ranks of Strength upgrades purchased."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Protect: Spend a to gain +1 defense. Unleash: Spend a to inflict 1 strain on target."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to affect 1 additional target within range per rank of Magnitude purchased."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Protect: Spend [FORCE] to allow power to protect against all types of attack. Unleash: Spend [FORCE] to give the attack Ensnare 2."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Range",
        "xp": 20,
        "text": "Spend [FORCE] [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 1,
        "span": 1,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] to decrease damage equal to ranks of Strength upgrades purchased."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Strength",
        "xp": 20,
        "text": "Spend [FORCE] to decrease damage equal to ranks of Strength upgrades purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Protect: If no z generated [FORCE] the power reduces damage of all attacks hitting the target. Unleash: Spend [FORCE] to give the attack Burn 2."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 25,
        "text": "Protect: Light side Force users may spend 1 Destiny Point to use Protect as an out-of-turn-incidental once per session. Unleash: Dark side Force users may spend 1 Destiny Point to use Unleash as a maneuver once per session."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Mastery",
        "xp": 25,
        "text": "Protect: Light side Force user may spend [FORCE] [FORCE] to reflect all attacks they reduce to 0 damage, dealing damage equal to initial attack to attacker. Unleash: Dark side Force users may spend [FORCE] to reduce critical rating of attacks to 1."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        3
      ],
      [
        2,
        6
      ],
      [
        3,
        4
      ],
      [
        3,
        7
      ],
      [
        4,
        8
      ],
      [
        5,
        6
      ],
      [
        5,
        9
      ],
      [
        6,
        7
      ],
      [
        6,
        10
      ],
      [
        7,
        8
      ],
      [
        8,
        12
      ],
      [
        9,
        13
      ],
      [
        10,
        11
      ],
      [
        12,
        14
      ]
    ]
  },
  {
    "key": "fp_seek",
    "name": "Seek",
    "prereqRating": 1,
    "source": "Force and Destiny core 302",
    "page": 190,
    "baseXp": 10,
    "baseText": "The Force user allows the will of the Force to lead the way to something lost or forgotten. The user may spend [FORCE] [FORCE] to gain insight into the general location or direction of a person or object that he knows about, regardless of current distance. The user may spend [FORCE] and succeed at an Average (dd ) Vigilance check (or opposed Vigilance vs. Discipline check) to see through illusions.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 2,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to gain additional detail per Magnitude upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ongoing effect: Commit [FORCE]. Upgrade the ability of Vigilance and Perception checks once."
      },
      {
        "row": 1,
        "col": 0,
        "span": 1,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] to eliminate 1 Force-based illusion per Strength upgrade purchased."
      },
      {
        "row": 1,
        "col": 1,
        "span": 2,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to gain additional detail per Magnitude upgrade purchased."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to gain additional detail per Magnitude upgrade purchased."
      },
      {
        "row": 2,
        "col": 0,
        "span": 1,
        "name": "Control",
        "xp": 15,
        "text": "Spend [FORCE] track one additional target."
      },
      {
        "row": 2,
        "col": 1,
        "span": 2,
        "name": "Strength",
        "xp": 15,
        "text": "Spend [FORCE] to eliminate 1 Force-based illusion per Strength upgrade purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Magnitude",
        "xp": 15,
        "text": "Spend [FORCE] to gain additional detail per Magnitude upgrade purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 1,
        "name": "Duration",
        "xp": 20,
        "text": "Commit [FORCE] to continue tracking target, even when it moves."
      },
      {
        "row": 3,
        "col": 1,
        "span": 2,
        "name": "Control",
        "xp": 15,
        "text": "Ongoing effect: [FORCE] [FORCE] [FORCE]. The user's attacks gain Pierce with rating equal to Cunning plus ranks in Perception."
      },
      {
        "row": 3,
        "col": 3,
        "span": 1,
        "name": "Mastery",
        "xp": 20,
        "text": "Make Seek power check and spend [FORCE] [FORCE] [FORCE] to add x to combat checks against one target for remainder of encounter."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        5
      ],
      [
        4,
        7
      ],
      [
        6,
        7
      ],
      [
        6,
        9
      ],
      [
        7,
        8
      ],
      [
        7,
        10
      ],
      [
        8,
        11
      ]
    ]
  },
  {
    "key": "fp_sense",
    "name": "Sense",
    "prereqRating": 1,
    "source": "Edge of the Empire core 280, Force and Destiny core 304",
    "page": 191,
    "baseXp": 10,
    "baseText": "The Force User can sense the Force interacting with the world around him. The user may spend [FORCE] to sense all living things within short range (including sentient and non-sentient beings). The user may spend [FORCE] to sense the current emotional state of one living target with whom he is engaged.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ongoing effect: Commit [FORCE]. Once per round, when an attack targets the Force user, he upgrades the difficulty of the pool once."
      },
      {
        "row": 0,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Effect: Spend [FORCE]. The Force user senses the current thoughts of one living target with whom he is engaged."
      },
      {
        "row": 1,
        "col": 0,
        "span": 2,
        "name": "Duration",
        "xp": 10,
        "text": "Sense's ongoing effects may be triggered one additional time per round."
      },
      {
        "row": 1,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Magnitude",
        "xp": 5,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 2,
        "col": 0,
        "span": 2,
        "name": "Strength",
        "xp": 10,
        "text": "When using Sense's ongoing effects, upgrade the pool twice, instead of once."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 10,
        "text": "Ongoing effect: Commit [FORCE]. Once per round, when making a combat check, he upgrades the ability of that check once."
      },
      {
        "row": 3,
        "col": 2,
        "span": 1,
        "name": "Range",
        "xp": 10,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to range upgrades purchased."
      },
      {
        "row": 3,
        "col": 3,
        "span": 1,
        "name": "Magnitude",
        "xp": 10,
        "text": "Spend [FORCE] to increase number of targets affected by power equal to magnitude upgrades purchased."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        4
      ],
      [
        2,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        7
      ],
      [
        5,
        8
      ],
      [
        6,
        9
      ],
      [
        7,
        10
      ],
      [
        8,
        11
      ]
    ]
  },
  {
    "key": "fp_suppress",
    "name": "Suppress",
    "prereqRating": 1,
    "source": "Keeping the Peace 39",
    "page": 192,
    "baseXp": 5,
    "baseText": "The Force user can dampen the effect of incoming Force powers, dramatically diminishing their effect on himself and his allies. The user may spend [FORCE] to add automatic f to Force power checks made against him or any ally within short range until the end of his next turn.",
    "rows": 4,
    "cells": [
      {
        "row": 0,
        "col": 0,
        "span": 2,
        "name": "Strength",
        "xp": 5,
        "text": "Spend [FORCE] to add additional automatic f equal to Strength upgrades purchased to hostile Force power checks."
      },
      {
        "row": 0,
        "col": 2,
        "span": 1,
        "name": "Duration",
        "xp": 5,
        "text": "Ongoing effect: Commit [FORCE] to sustain ongoing effects of the power on each affected target while within range."
      },
      {
        "row": 0,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 1,
        "col": 0,
        "span": 3,
        "name": "Control",
        "xp": 10,
        "text": "Commit one or more [FORCE] When an opponent targets the user with a Force power, after the opponent generates [FORCE], reduce the total [FORCE] generated by 1 per [FORCE] committed. to a minimum of 0."
      },
      {
        "row": 1,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 2,
        "col": 0,
        "span": 2,
        "name": "Strength",
        "xp": 10,
        "text": "Spend [FORCE] to add additional automatic f equal to Strength upgrades purchased to hostile Force power checks."
      },
      {
        "row": 2,
        "col": 2,
        "span": 1,
        "name": "Control",
        "xp": 10,
        "text": "Spend 1 Destiny Point to use Suppress as an out of turn incidental once per session."
      },
      {
        "row": 2,
        "col": 3,
        "span": 1,
        "name": "Range",
        "xp": 5,
        "text": "Spend [FORCE] to increase power's range by a number of range bands equal to Range upgrades purchased."
      },
      {
        "row": 3,
        "col": 0,
        "span": 2,
        "name": "Control",
        "xp": 20,
        "text": "Thee user may make a Suppress power check along with an opposed Discipline vs. Discipline check targeting another Force user within short range. If the user spends [FORCE] [FORCE] and succeeds on the check, the target Force user immediately uncommits all [FORCE] and ends all ongoing effects of Force powers and Force talents that required committed [FORCE]."
      },
      {
        "row": 3,
        "col": 2,
        "span": 2,
        "name": "Control",
        "xp": 15,
        "text": "Whenever a Force user targets a character affected by Suppress with a hostile Force power, if that opponent used z to generate [FORCE] on the check, he suffers strain equal to the user's ranks in Discipline."
      }
    ],
    "links": [
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        1,
        4
      ],
      [
        2,
        3
      ],
      [
        2,
        4
      ],
      [
        4,
        5
      ],
      [
        4,
        6
      ],
      [
        4,
        7
      ],
      [
        6,
        9
      ],
      [
        7,
        8
      ],
      [
        7,
        10
      ]
    ]
  }
];
