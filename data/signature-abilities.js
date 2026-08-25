window.SW = window.SW || {};
// Signature abilities, read from the printed trees. Each is attached to the
// bottom of one in-career specialization; the active nodes name the bottom-row
// talents that tree must already have (Enter the Unknown p.34).
window.SW.signatureAbilities = [
  {
    "key": "sig_always_get_my_mark",
    "name": "Always Get My Mark",
    "careerKey": "BOUNT",
    "source": "No Disintegrations 39",
    "page": 15,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may choose a known minion NPC on the same planet to be her mark, spend 2 Destiny Points and make a Hard (ddd ) Streetwise check. If she succeeds, the character tracks down the chosen mark, a new encounter begins as the character reaches the mark's location. The exact nature of the encounter, as well as the circumstances under which it takes place, must by approved by the GM (see Narrative Abilities, ND:40).",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Change Skill",
        "xp": 10,
        "text": "May activate Always Get My Mark with Knowledge (Underworld) instead of Streetwise."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Destiny",
        "xp": 10,
        "text": "Always Get My Mark costs 1 Destiny Points instead of 2."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Increase Effect",
        "xp": 10,
        "text": "Upgrade the difficulty of the check once to find a rival NPC instead of a minion."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "May activate Always Get My Mark with Survival instead of Streetwise."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Always Get My Mark to Average (dd )"
      },
      {
        "row": 1,
        "col": 1,
        "name": "Takedown",
        "xp": 15,
        "text": "Upgrade the difficulty of the check once to begin with the mark in custody."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Range",
        "xp": 15,
        "text": "If the character has a starship of access to interstellar travel, she may choose a character a a different planet to be her mark. If she does so, she travels to that mark's world."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Increase Effect",
        "xp": 15,
        "text": "Upgrade the difficulty of the check twice to find a nemesis NPC (or player character) instead of a minion."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        true,
        false
      ],
      "row1h": [
        false,
        true,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unmatched_devastation",
    "name": "Unmatched Devastation",
    "careerKey": "BOUNT",
    "source": "No Disintegrations 41",
    "page": 16,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, after performing a combat check, the character may spend 2 Destiny points to perform an additional combat check against the same target with the difficulty increased by 1 for each successful combat check the character has performed this turn. This combat check must be made using a non-starship/vehicle weapon that the character has not already used this turn.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Number",
        "xp": 10,
        "text": "Perform additional checks equal to ranks in Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Draw and Fire",
        "xp": 10,
        "text": "Before performing each combat check with Unmatched Devastation, the character may holster and draw a weapon."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Target Priority",
        "xp": 10,
        "text": "The character may choose a new legal target for each combat check made as part of Unmatched Devastation."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Remove Setback",
        "xp": 10,
        "text": "When making a combat check as part of Unmatched Devastation, remove b equal to ranks in Remove Setback upgrade."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Increase Number",
        "xp": 15,
        "text": "Perform additional checks equal to ranks in Increase Number upgrade."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Remove Setback",
        "xp": 15,
        "text": "When making a combat check as part of Unmatched Devastation, remove b equal to ranks in Remove Setback upgrade."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Improve Mobility",
        "xp": 15,
        "text": "Before performing a combat check as part of Unmatched Devastation, suffer 2 strain to perform the Move maneuver as an incidental."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Increase Number",
        "xp": 15,
        "text": "Perform additional checks equal to ranks in Increase Number upgrade."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        false
      ],
      "row1h": [
        false,
        true,
        true
      ],
      "row2h": [
        true,
        true,
        false
      ],
      "row1to2": [
        false,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_teamwork",
    "name": "Unmatched Teamwork",
    "careerKey": "CLONE",
    "source": "Collapse of the Republic 46",
    "page": 23,
    "nodes": [
      true,
      false,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per session as an incidental, the character may spend 2 Destiny Points to activate Unmatched Teamwork. Until the end of the Encounter, the character may assist another character as an incidental (instead of a maneuver) once per round.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Effect",
        "xp": 10,
        "text": "The character's assistance instead adds sa."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Effect",
        "xp": 10,
        "text": "The character's assistance instead adds s."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Remove Setback",
        "xp": 10,
        "text": "The character's assistance also removes b."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Increase Range",
        "xp": 10,
        "text": "Increase the range at which the character can provide assistance by one range band."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Increase Effect",
        "xp": 15,
        "text": "The character's assistance instead adds x."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Teamwork costs 1 fewer Destiny Points to activate."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Range",
        "xp": 15,
        "text": "Increase the range at which the character can provide assistance by one range band."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Camaraderie",
        "xp": 15,
        "text": "When the character provide assistance, they heal 2 strain from themself."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        false,
        true
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        false,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_insightful_revelation",
    "name": "Insightful Revelation",
    "careerKey": "COLO",
    "source": "Far Horizons 36",
    "page": 30,
    "nodes": [
      false,
      true,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may perform an Insightful Revelation action and spend 2 Destiny points to make a Hard (ddd ) Knowledge (Education) check. If he succeeds, he learns some valuable information that he did not previously possess pertaining to his current situation. What he learns is up to the GM, but it must be valuable to the player overcoming his immediate encounter or situation, and the information cannot be obtainable by any other immediately available means.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Insightful Revelation."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Destiny",
        "xp": 10,
        "text": "Insightful Revelation costs 1 Destiny Point instead of 2."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Reduce Difficulty",
        "xp": 10,
        "text": "Reduce the difficulty of the skill check to activate Insightful Revelation to Average (dd )."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Additional Skills",
        "xp": 10,
        "text": "When making the Insightful Revelation action, the character may replace Knowledge (Education) with any other Knowledge skill."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Add Boost",
        "xp": 15,
        "text": "Add b to skill check to activate Insightful Revelation."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Reduce Setback",
        "xp": 15,
        "text": "Remove b from skill check to activate Insightful Revelation."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Effect",
        "xp": 15,
        "text": "If the check is successful, the character may spend x to gain one additional piece of equally useful information."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Duration",
        "xp": 15,
        "text": "The character may perform the Insightful Revelation action one additional time per game session."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        true,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_expertise",
    "name": "Unmatched Expertise",
    "careerKey": "COLO",
    "source": "Far Horizons 37",
    "page": 31,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an action, the character may spend two Destiny Points to reduce the difficulty of all career skill checks he makes by one to a minimum of Easy for the remainder of the encounter",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Unmatched Expertise."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Activation",
        "xp": 10,
        "text": "Unmatched Expertise becomes a maneuver, instead of an action."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Activation",
        "xp": 10,
        "text": "Unmatched Expertise becomes an incidental that may be triggered out of turn, instead of an action."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Unmatched Expertise."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 15,
        "text": "Remove b from skill check to activate Unmatched Expertise."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Superior Reduction",
        "xp": 15,
        "text": "Once per session while Unmatched Expertise is activated, may reduce the difficulty of one non-career skill."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Expertise costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "The difficulty of all career skill checks is reduced to a minimum of Simple instead of Easy."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        false,
        true
      ],
      "row1h": [
        false,
        true,
        false
      ],
      "row2h": [
        true,
        false,
        false
      ],
      "row1to2": [
        true,
        false,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_rousing_oratory",
    "name": "Rousing Oratory",
    "careerKey": "COMMANDER",
    "source": "Lead by Example 39",
    "page": 38,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may perform a Rousing Oratory action, spend 2 Destiny Points and make a Hard (ddd ) Leadership check to inspire a group to take action in a military situation about which members were previously hesitant.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Change Skill",
        "xp": 10,
        "text": "May make a Discipline check instead of a Leadership check to activate Rousing Oratory."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Rousing Oratory."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Recover Strain",
        "xp": 10,
        "text": "Friendly characters and NPC's targeted by Rousing Oratory recover a number of strain equal to the character's ranks in Leadership."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "May make a Cool check instead of a Leadership check to activate Rousing Oratory."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Boost Allies",
        "xp": 15,
        "text": "After triggering Rousing Oratory, add b per Boost Allies upgrade to all Discipline and Cool checks that other friendly characters and NPC's make until the end of the encounter."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Rousing Oratory to Average ( dd )."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Turning Point",
        "xp": 15,
        "text": "During a Mass Combat, may activate Rousing Oratory to create a turning point or boost allies already taking part in one."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Destiny",
        "xp": 15,
        "text": "Rousing Oratory costs 1 Destiny Point instead of 2."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        true,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_authority",
    "name": "Unmatched Authority",
    "careerKey": "COMMANDER",
    "source": "Lead by Example 41",
    "page": 39,
    "nodes": [
      true,
      false,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, as an action during an encounter in structured time, the character may spend 2 Destiny Points to gain the following ability for the remainder of the current round and two additional rounds. As an out of turn incidental, the character may suffer 2 strain to downgrade the difficulty of an ally's skill check once.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Authority lasts one additional turn."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Firmresolve",
        "xp": 10,
        "text": "Increase strain threshold by 2 while Unmatched Authority is active."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Authority lasts one additional turn."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Mass Combat",
        "xp": 10,
        "text": "The character can spend strain to modify Mass Combat checks with Unmatched Authority as though it was an ally's skill check."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Authority costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Endurance",
        "xp": 15,
        "text": "Reduce the strain cost to modify an ally's skill check with Unmatched Authority by 1."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Effect",
        "xp": 15,
        "text": "May remove b from an ally's skill check instead of downgrading the difficulty."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Increase Effect",
        "xp": 15,
        "text": "May reduce the difficulty of an ally's skill check instead of downgrading the difficulty."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_much_to_learn",
    "name": "Much to Learn",
    "careerKey": "CONSULAR",
    "source": "Disciples of Harmony 34",
    "page": 46,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session the character may spend 2 Destiny Points and make a Hard (ddd ) Knowledge (Education) check, then choose one talent that the character possesses for the remainder of the current encounter, on allied character within medium range counts as having that talent. If that talent is ranked, the allied character counts as having as many ranks in the talent as the character with this signature ability does.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Number",
        "xp": 10,
        "text": "Increase number of allies affected by 2 per Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Reduce Difficulty",
        "xp": 10,
        "text": "Reduce the difficulty of the skill check to activate Much to Learn to Average (dd )."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Destiny",
        "xp": 10,
        "text": "Much to Learn costs 1 Destiny Point instead of 2."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Increase Number",
        "xp": 10,
        "text": "Increase number of allies affected by 2 per Increase Number upgrade."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Change Skill",
        "xp": 15,
        "text": "May make a Leadership check instead of a Knowledge (Education) check to activate Much to Learn."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Change Skill",
        "xp": 15,
        "text": "May make any Knowledge skill check instead of Knowledge (Education) to activate Much to Learn."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Improve Talent",
        "xp": 15,
        "text": "If the character possesses the improved version of the chosen talent, allies affected count as possessing it too for the duration of the encounter."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Supreme Talent",
        "xp": 15,
        "text": "If the character possesses the supreme version of the chosen talent, allies affected count as possessing it too for the duration of the encounter."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        false,
        true,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unmatched_negotiation",
    "name": "Unmatched Negotiation",
    "careerKey": "CONSULAR",
    "source": "Disciples of Harmony 35",
    "page": 47,
    "nodes": [
      false,
      true,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, the character may spend 2 Destiny Points. For the rest of the round, whenever that character makes a Charm, Coercion, Deception, or Negotiation check,, the character downgrades the difficulty of the check the number of times needed to remove all c from the pool",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Negotiation lasts for 1 additional round."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Effect",
        "xp": 10,
        "text": "Engaged allied characters making Charm, Coercion, Deception, or Negotiation checks while this power is active downgrade their difficulty once."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Negotiation lasts for 1 additional round."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Destiny",
        "xp": 10,
        "text": "Unmatched Negotiation costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Remove Setback",
        "xp": 15,
        "text": "Remove b from any checks affected by Unmatched Negotiation."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Negotiation lasts for 1 additional round."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Range",
        "xp": 15,
        "text": "Increase the range at which this ability affects allied PCs to medium range."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Add Triumph",
        "xp": 15,
        "text": "Whenever the character fails a Charm, Coercion, Deception, or Negotiation check, while this power is active, the character adds automatic x to the results."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        false,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        false
      ]
    }
  },
  {
    "key": "sig_diplomatic_solution",
    "name": "Diplomatic Solution",
    "careerKey": "DIPLOMAT",
    "source": "Desperate Allies 39",
    "page": 54,
    "nodes": [
      false,
      true,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session, when a combat encounter against one or more sentient creatures is about to begin, the character may spend 2 Destiny Points and make a Daunting (dddd ) Charm check to turn the encounter into a social encounter instead.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Change Skill",
        "xp": 10,
        "text": "May make a Coercion check instead of a Charm check to activate Diplomatic Solution."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Diplomatic Solution."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Boost Allies",
        "xp": 10,
        "text": "Other friendly characters gain b on social checks until the end of the encounter per Boost Allies upgrade."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "May make a Leadership check instead of a Charm check to activate Diplomatic Solution."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Activation",
        "xp": 15,
        "text": "May activate Diplomatic Solution at the start of any combat turn instead of only at the start of combat."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Diplomatic Solution to Hard ( ddd )."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Destiny",
        "xp": 15,
        "text": "Diplomatic Solution costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Boost Allies",
        "xp": 15,
        "text": "Other friendly characters gain b on social checks until the end of the encounter per Boost Allies upgrade."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        false,
        true
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_insight",
    "name": "Unmatched Insight",
    "careerKey": "DIPLOMAT",
    "source": "Desperate Allies 41",
    "page": 55,
    "nodes": [
      true,
      true,
      false,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, during an encounter or scene involving one or more other sentient creatures, the character may spend 2 Destiny Points. The character immediately becomes aware of the emotional states and basic histories of up to 3 chosen participants in the scene.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Discern Motives",
        "xp": 10,
        "text": "The character realizes the motivations of each other participant in the scene."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Number",
        "xp": 10,
        "text": "Increase the number of participants affected by 2 per Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Increase Number",
        "xp": 10,
        "text": "Increase the number of participants affected by 2 per Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Frequency",
        "xp": 10,
        "text": "Unmatched Insight may be used twice per game session."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Leverage",
        "xp": 15,
        "text": "Choose 1 character. Upgrade the ability of all social checks against that character once per Leverage upgrade until the end of the encounter. 15 XP Unmatched Insight costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Insight costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Leverage",
        "xp": 15,
        "text": "Choose 1 character. Upgrade the ability of all social checks against that character once per Leverage upgrade until the end of the encounter."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Secret",
        "xp": 15,
        "text": "Notice one important detail that a chosen character would prefer to conceal."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        false
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_the_harder_they_fall",
    "name": "The Harder They Fall",
    "careerKey": "ENGINEER",
    "source": "Fully Operational 34",
    "page": 62,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, the character may spend 2 Destiny Points and make a Hard (ddd ) Mechanics check. If successful, for the remainder of the encounter, combat checks the character makes against vehicles, structures, or droids that inflict wounds or hull trauma automatically inflict Critical Injury or Critical Hit (depending on the target). a or x can be spent to trigger the attack's critical rating additional times, adding +10 to the critical roll as usual.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Number",
        "xp": 10,
        "text": "The effects of The Harder They Fall extend to a number of allies withing medium range equal to ranks in Increase Number."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Change Skill",
        "xp": 10,
        "text": "The skill check to activate The Harder They Fall can be made using Knowledge (Education) or Knowledge (Warfare) instead of Mechanics."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Increase Number",
        "xp": 10,
        "text": "The effects of The Harder They Fall extend to a number of allies withing medium range equal to ranks in Increase Number."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Ignoredefenses",
        "xp": 10,
        "text": "While The Harder They Fall is active, combat checks that the character makes ignore one point of defense rating per Ignore Defenses."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Ignoredefenses",
        "xp": 15,
        "text": "While The Harder They Fall is active, combat checks that the character makes ignore one point of defense rating per Ignore Defenses."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "The Harder They Fall costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "The difficulty of the skill check to activate The Harder They Fall is Average (ddd ) instead of Hard (ddd )."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Frequency",
        "xp": 15,
        "text": "The hHarder They Fall can be used on e additional time per game session."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        false,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_ingenuity",
    "name": "Unmatched Ingenuity",
    "careerKey": "ENGINEER",
    "source": "Fully Operational 35",
    "page": 63,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an action, the character may spend 2 Destiny Points and make a Hard (ddd ) Mechanics check. If successful, he can add one item quality (except Breach or Concussive) to a weapon or item he is holding or operating. If applicable, the item quality has rating of 1. The character may spend x to add one additional quality to the same item, and a to increase and item's quality rating by 1. This alteration lasts for 2 rounds, or ten minutes of narrative time.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Add Boost",
        "xp": 10,
        "text": "When making the skill check to activate Unmatched Ingenuity, the character adds b per Add Boost upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Duration",
        "xp": 10,
        "text": "The alteration from using Unmatched Ingenuity lasts for 1 additional round per Duration Upgrade."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Add Boost",
        "xp": 10,
        "text": "When making the skill check to activate Unmatched Ingenuity, the character adds b per Add Boost upgrade."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Duration",
        "xp": 10,
        "text": "The alteration from using Unmatched Ingenuity lasts for 1 additional round per Duration Upgrade."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Quality",
        "xp": 15,
        "text": "The character may also apply the Breach item quality to the weapon or item."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Ingenuity costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "The difficulty of the skill check to activate Unmatched Ingenuity is Average (dd ) instead of Hard (ddd )."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Quality",
        "xp": 15,
        "text": "The character may also apply the Concussive item quality to the weapon or item."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        false
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        false,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_sudden_discovery",
    "name": "Sudden Discovery",
    "careerKey": "EXPLORER",
    "source": "Enter the Unknown 34",
    "page": 70,
    "nodes": [
      true,
      true,
      false,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may spend 2 Destiny Points to make a Hard (ddd ) Knowledge (Outer Rim) or Knowledge (Core Worlds) check. If he succeeds, the character can pinpoint his exact location without a map or other guide, discover a lost or hidden item or location, or identify a safe and fast path through any terrain. The exact nature of what the character is trying to accomplish, as well as the end results, must be approved by the",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Gm. Add Boost",
        "xp": 10,
        "text": "Add b to skill check to activate Sudden Discovery."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Sudden Discovery."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Sudden Discovery."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "Sudden Discovery can be activated with the Astrogation or Survival skills."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Add Boost",
        "xp": 15,
        "text": "Add b to skill check to activate Sudden Discovery."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Sudden Discovery to Average (dd )."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Frequency",
        "xp": 15,
        "text": "Sudden Discovery may be used twice per game session."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Destiny",
        "xp": 15,
        "text": "Sudden Discovery costs 1 Destiny Point instead of 2."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        true,
        true
      ],
      "row1h": [
        false,
        true,
        false
      ],
      "row2h": [
        true,
        true,
        false
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_mobility",
    "name": "Unmatched Mobility",
    "careerKey": "EXPLORER",
    "source": "Enter the Unknown 35",
    "page": 71,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, the character may spend 2 Destiny Points to increase the number of maneuvers he is allowed to perform in a turn to three for the next two rounds. This third maneuver may be gained through any of the means a second maneuver is normally gained.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Mobility lasts for one additional round."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Free Maneuver",
        "xp": 10,
        "text": "Gain one additional free maneuver while base ability is active. This does not increase per turn maneuvers."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Free Maneuver",
        "xp": 10,
        "text": "Gain one additional free maneuver while base ability is active. This does not increase per turn maneuvers."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Melee Defense",
        "xp": 10,
        "text": "Gain +1 Melee defense while Unmatched Mobility is active."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Mobility lasts for one additional round."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Mobility lasts for one additional round."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Mobility costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Ranged Defense",
        "xp": 15,
        "text": "Gain +1 ranged defense while Unmatched Mobility is active."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        false,
        true
      ],
      "row1h": [
        false,
        true,
        false
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_fated_duel",
    "name": "Fated Duel",
    "careerKey": "GUARD",
    "source": "Keeping the Peace 35",
    "page": 78,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session, during a combat encounter, the character may spend 2 Destiny Points and make a Hard (ddd ) Discipline check to challenge another character. If he succeeds. the two characters are locked in a duel for 3 rounds. For the duration or the duel, the two dueling characters can only make attacks targeting each other and no other characters can target the dueling characters with attacks (or otherwise intervene).",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Difficulty",
        "xp": 10,
        "text": "Reduce the difficulty of the skill check to activate Fated Duel to Average (dd )."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Inspiration",
        "xp": 10,
        "text": "Add b per ranks in Inspiration purchased to checks made by allies while Fated Duel is active."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Duration",
        "xp": 10,
        "text": "Fated Duel lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Stand Firm",
        "xp": 10,
        "text": "Increase wound threshold by +4 per Stand Firm upgrade purchased while Fated Duel is active"
      },
      {
        "row": 1,
        "col": 0,
        "name": "Stand Firm",
        "xp": 15,
        "text": "Increase wound threshold by +4 per Stand Firm upgrade purchased while Fated Duel is active"
      },
      {
        "row": 1,
        "col": 1,
        "name": "Duration",
        "xp": 15,
        "text": "Fated Duel lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Inspiration",
        "xp": 15,
        "text": "Add b per ranks in Inspiration purchased to checks made by allies while Fated Duel is active."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Cosmic Balance",
        "xp": 15,
        "text": "Whenever the character suffers a Critical Injury while Fated Duel is active. flip one Dark Side Destiny point to a Light Side Destiny Point."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        false,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_heroism",
    "name": "Unmatched Heroism",
    "careerKey": "GUARD",
    "source": "Keeping the Peace 37",
    "page": 79,
    "nodes": [
      true,
      true,
      false,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, as an out of turn incidental, the character may spend 2 Destiny Points. For the next 2 rounds, whenever an ally within short range is targeted by a successful combat check, the character may suffer 2 strain to move to engaged range of that ally and become the target of the combat check instead.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Heroism lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Endurance",
        "xp": 10,
        "text": "Reduce the strain cost to become the target of an attack with Unmatched Heroism by 1 per Endurance upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Destiny",
        "xp": 10,
        "text": "Unmatched Heroism costs 1 Destiny Point instead of 2."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Heroism lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Frequency",
        "xp": 15,
        "text": "Unmatched Heroism may be used twice per game session."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Range",
        "xp": 15,
        "text": "Increase the range at which Unmatched Heroism can affect allies to medium range."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Heroism lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Endurance",
        "xp": 15,
        "text": "Reduce the strain cost to become the target of an attack with Unmatched Heroism by 1 per Endurance upgrade purchased."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        true,
        false
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_last_one_standing",
    "name": "Last One Standing",
    "careerKey": "HIREDGUN",
    "source": "Dangerous Covenants 36",
    "page": 86,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, during a combat encounter, the character may spend 2 Destiny Points to make a Hard (ddd ) Resilience check. If he succeeds, he skips his next turn and eliminates all enemy minions in the encounter. (The minions are all eliminated immediately, so will not get to participate further in the combat, but for the sake of the narrative, the PC can spend the next round of combat incapacitating them). The narrative means by which he accomplishes this is up to the player, must be approved by the",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Gm. Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Last One Standing."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Add Boost",
        "xp": 10,
        "text": "Add b to skill check to active Last One Standing."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Last One Standing."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Add Boost",
        "xp": 10,
        "text": "Add b to skill check to active Last One Standing."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Last One Standing to Average (dd )."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Increase Effect",
        "xp": 15,
        "text": "When triggering Last One Standing, also eliminate one rival per Increase Effect upgrade."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Effect",
        "xp": 15,
        "text": "When triggering Last One Standing, also eliminate one rival per Increase Effect upgrade."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Destiny",
        "xp": 15,
        "text": "Last One Standing costs 1 Destiny Point instead of 2."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        false,
        false,
        false
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_protection",
    "name": "Unmatched Protection",
    "careerKey": "HIREDGUN",
    "source": "Dangerous Covenants 37",
    "page": 87,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, the character may spend 2 Destiny Points to gain the following ability: once per round, after suffering a hit and determining damage, the character may halve the damage (rounded up) dealt before it is applied to his soak. This ability is active for the remainder of the current round and two additional rounds.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Protection lasts for one additional round."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Protection lasts for one additional round."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Soak",
        "xp": 10,
        "text": "Gain +1 soak while Unmatched Protection is active."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Protect Ally",
        "xp": 10,
        "text": "Once per session, while ability is active, may choose to be hit by an attack that would hit an engaged ally."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Protection lasts for one additional round."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Protection costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Additional Reduction",
        "xp": 15,
        "text": "May reduce the damage of 1 additional hit suffered each round."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Additional Reduction",
        "xp": 15,
        "text": "May reduce the damage of 1 additional hit suffered each round."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        false,
        true
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_peerless_interception",
    "name": "Peerless Interception",
    "careerKey": "JEDI",
    "source": "Collapse of the Republic 47",
    "page": 92,
    "nodes": [
      false,
      true,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per session as an out-of-turn incidental, may spend 2 Destiny Points to activate Peerless Interception. For the next two rounds, when the character uses Parry or Reflect to reduce the damage of a hit, they reduce the damage by an additional amount equal to their Force rating.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Destiny",
        "xp": 10,
        "text": "Peerless Interception costs 1 fewer Destiny Point to activate."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Duration",
        "xp": 10,
        "text": "Peerless Interception lasts one additional round."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Increase Duration",
        "xp": 10,
        "text": "Peerless Interception lasts one additional round."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Critical Counter",
        "xp": 10,
        "text": "When the character spends y to inflict a hit on their attacker using Improved Parry or Improved Reflect, they also inflict a Critical Injury."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Reduce Strain",
        "xp": 15,
        "text": "The character only suffers strain the first time they use Parry or Reflect each round."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Activate Quality",
        "xp": 15,
        "text": "When the character uses improved Parry or Improved Reflect to inflict a hit on an attacker, they may activate one item quality."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Effortless Counter",
        "xp": 15,
        "text": "Once per round, character may use Improved Parry or Improved Reflect to inflict a hit on their attacker without spending t or y."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Increase Frequency",
        "xp": 15,
        "text": "The character may activate Peerless Interception on e additional time per session."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        false,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_prophecy",
    "name": "Prophecy",
    "careerKey": "MYSTIC",
    "source": "Unlimited Power 35",
    "page": 99,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may spend 1 Destiny point and make a Hard (ddd ) Vigilance check to utter a prophecy. If they succeed, they foretell a single event, the focus of which is centered around themself. At any time before the end of the game session, they may spend 1 Destiny Point, at which point the foretold event transpires. The GM should interpret the prophecy to fit the scene, possibly revealing truths the character did not foresee in the process.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from the check to activate Prophecy per Reduce Setback upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Flow of the Universe",
        "xp": 10,
        "text": "Add b to the character's checks to bring the foretold event to fruition."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Shared Revelation",
        "xp": 10,
        "text": "The prophecy may pertain to any one other character who hears it."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from the check to activate Prophecy per Reduce Setback upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Recurrence",
        "xp": 15,
        "text": "One additional time before the end of the game session, the character may spend 1 Destiny Point to have the prophecy's foretold event recur, likely in a different form."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Prophecy to Average (dd )."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Doom",
        "xp": 15,
        "text": "Add b to any character's checks to prevent the foretold event from occurring."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Destiny",
        "xp": 15,
        "text": "Prophecy costs 1 fewer Destiny Points to activate. It still requires a Destiny Point to trigger the occurrence of the prophesied event."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        true,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_destiny",
    "name": "Unmatched Destiny",
    "careerKey": "MYSTIC",
    "source": "Unlimited Power 37",
    "page": 100,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, after making a Force power check, the character may spend 2 Destiny Points to re-roll up to 2 Force dice. Conflict generated as part of this Force power check is doubled.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Number",
        "xp": 10,
        "text": "Re-roll up to 1 additional Force die per Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Destiny",
        "xp": 10,
        "text": "Unmatched Destiny costs 1 fewer Destiny Points to activate."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Increase Number",
        "xp": 10,
        "text": "Re-roll up to 1 additional Force die per Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Shared Destiny",
        "xp": 10,
        "text": "Unmatched Destiny can be used after another character at short range makes a Force power check."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Frequency",
        "xp": 15,
        "text": "Unmatched Destiny can be used 1 additional time per session per Frequency upgrade purchased."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Increase Number",
        "xp": 15,
        "text": "Re-roll up to 1 additional Force die per Increase Number upgrade."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Unleashed Power",
        "xp": 15,
        "text": "For each ZZ result, add automatic Z to the check. For each zz result add automatic z to the check."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Frequency",
        "xp": 15,
        "text": "Unmatched Destiny can be used 1 additional time per session per Frequency upgrade purchased."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        true,
        true
      ],
      "row1h": [
        true,
        true,
        false
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        false,
        false,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unexpected_demise",
    "name": "Unexpected Demise",
    "careerKey": "SEEKER",
    "source": "Unlimited Power 35",
    "page": 107,
    "nodes": [
      true,
      false,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per session as an action, the character may spend 2 Destiny Points and make a Hard (ddd ) Perception check. If successful, for the next 2 rounds the character may spend 1 maneuver to add 1 automatic x to his next combat check made in that turn. In addition, for the next 2 rounds when the character inflicts a Critical Injury on a rival NPC, the target is immediately incapacitated in the same way as a minion NPC (See page 400 of the Force and Destiny Core Rulebook).",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "When making a combat check while Unexpected Demise is active, the character removes b per Reduce Setback upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Duration",
        "xp": 10,
        "text": "Unexpected Demise lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "When making a combat check while Unexpected Demise is active, the character removes b per Reduce Setback upgrade purchased."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Reduce Difficulty",
        "xp": 10,
        "text": "The skill check difficulty to activate Unexpected Demise is Average (dd ) instead of Hard (ddd )."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Duration",
        "xp": 15,
        "text": "Unexpected Demise lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "To activate Unexpected Demise, the character only needs to spend 1 Destiny Point instead of the normal 2 Destiny Points."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Duration",
        "xp": 15,
        "text": "Unexpected Demise lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Change Skill",
        "xp": 15,
        "text": "To activate Unexpected Demise, the character can use Discipline."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_pursuit",
    "name": "Unmatched Pursuit",
    "careerKey": "SEEKER",
    "source": "Unlimited Power 37",
    "page": 108,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, as an out of turn incidental, the character may spend 2 Destiny Points and designate one enemy character or vehicle within medium range (either personal or planetary scale) as the quarry. For the next 3 rounds, if the designated target would successfully elude pursuit, the character may voluntarily suffer 2 strain to keep pace, preventing the target from escaping.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Pursuit lasts for 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Range",
        "xp": 10,
        "text": "Increase the maximum range at which target can be selected to long range."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Endurance",
        "xp": 10,
        "text": "Reduce the strain cost to keep pace with the target by 1 (to a minimum of 0) per Endurance upgrade purchased."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Destiny",
        "xp": 10,
        "text": "To activate Unmatched Pursuit, the character only needs to spend 1 Destiny Point instead of the normal 2 Destiny Points."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Maneuver",
        "xp": 15,
        "text": "Should the target of Unmatched Pursuit spend a maneuver to increase the distance from the character, the character may immediately perform a Move maneuver as an out of turn incidental to close the distance between them."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Endurance",
        "xp": 15,
        "text": "Reduce the strain cost to keep pace with the target by 1 (to a minimum of 0) per Endurance upgrade purchased."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Frequency",
        "xp": 15,
        "text": "Unmatched Pursuit can be used twice per game session instead of once."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Pursuit lasts for 1 additional round per Duration upgrade purchased."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_my_city",
    "name": "My City",
    "careerKey": "SENTINEL",
    "source": "Endless Vigil 34",
    "page": 115,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session when in an urban setting, the character may spend 2 Destiny Points and make a Hard (ddd ) Knowledge (Core Worlds) or Knowledge (Outer Rim) check. If successful, for the remainder of the game session, the character may suffer 2 strain to recall or learn the location of any individual, group, or establishment within that city, and any relevant information.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Boost Skill",
        "xp": 10,
        "text": "When making a a skill check while My City is active, the character adds b to Streetwise and Survival checks."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Reducedifficulty",
        "xp": 10,
        "text": "The skill check difficulty to activate My City is Average ( dd ) instead of Hard (ddd )."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Cover Upgrade",
        "xp": 10,
        "text": "While My City is active and the character is in the chose city, whenever the character is in cover, he increases his ranged defense by 1."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Boost Skill",
        "xp": 10,
        "text": "When making a a skill check while My City is active, the character adds b to Skulduggery and Stealth checks."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Change Skill",
        "xp": 15,
        "text": "When activating My City, the character may make a Streetwise check instead of a Knowledge (Core Worlds / Outer Rim) check."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "To activate My City, the character only needs to spend 1 Destiny Point, instead of the normal 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Downgrade",
        "xp": 15,
        "text": "While My City is active and the character is in the chosen city, he may suffer 2 strain to downgrade the difficulty of any Stealth check once."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Change Skill",
        "xp": 15,
        "text": "When activating My City, the character may make a Knowledge (Underworld) check instead of a Knowledge (Core Worlds / Outer Rim) check."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        false,
        true
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_vigilance",
    "name": "Unmatched Vigilance",
    "careerKey": "SENTINEL",
    "source": "Endless Vigil 35",
    "page": 116,
    "nodes": [
      true,
      true,
      false,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, at the beginning of a structured encounter, the character may spend 2 Destiny Points. If he does so, he determines the Initiative order of the first round of the encounter. Characters still make checks to determine Initiative, but these results will only apply after Unmatched Vigilance effects end.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Always Alert",
        "xp": 10,
        "text": "After activating Unmatched Vigilance, the character may choose to use either Cool or Vigilance for his initiative check."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Group Vigilance",
        "xp": 10,
        "text": "All PCs add b fto their combat checks targeting any NPC who has already taken a turn during the current round."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Group Preparation",
        "xp": 10,
        "text": "All NPCs add b to their combat checks targeting any PC who has not yet taken a turn in the current round."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Duration",
        "xp": 10,
        "text": "The initiative order the base ability establishes lasts 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Duration",
        "xp": 15,
        "text": "The initiative order the base ability establishes lasts 1 additional round per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Combat Preparation",
        "xp": 15,
        "text": "When the character activates Unmatched Vigilance, he may choose to introduce a \"fact\" or additional context directly into the narrative as if he had spent a Destiny Point."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Combat Readiness",
        "xp": 15,
        "text": "After activating Unmatched Vigilance, the character may immediately perform 1 free maneuver."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Destiny",
        "xp": 15,
        "text": "To activate the Unmatched Vigilance base ability, the character only needs to spend 1 Destiny Point instead of the normal 2."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_narrow_escape",
    "name": "Narrow Escape",
    "careerKey": "SMUG",
    "source": "Fly Casual 37",
    "page": 123,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may spend two Destiny Points to make a Hard (ddd ) Streetwise check. If successful, the character is immediately able to flee from the current personal-scale combat encounter unscathed. The challenge is not overcome or defeated, but the character is able to evade the hazard or threat for the time being. The exact nature of what the character is trying to accomplish, as well as the end results, must be approved by the GM (see Narrative Abilities on page FC38), but should be suitably creative or daring.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from the skill check to activate Narrow Escape."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Effect",
        "xp": 10,
        "text": "Affect an additional number of allied characters equal to Cunning per Increase Effect upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Add Boost",
        "xp": 10,
        "text": "Add b to the skill check to activate Narrow Escape."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Scale",
        "xp": 10,
        "text": "Narrow Escape can be activated in a vehicle with the Piloting (Planetary) or Piloting (Space) skill."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Narrow Escape to Average (dd )."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Increase Effect",
        "xp": 15,
        "text": "Affect an additional number of allied characters equal to Cunning per Increase Effect upgrade purchased."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Change Skill",
        "xp": 15,
        "text": "Narrow Escape can be activated during social encounters with the Deception skill."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Destiny",
        "xp": 15,
        "text": "Narrow Escape costs 1 Destiny Point instead of 2."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unmatched_fortune",
    "name": "Unmatched Fortune",
    "careerKey": "SMUG",
    "source": "Fly Casual 39",
    "page": 124,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, the character may spend 2 Destiny Points to change the face of one positive die in the character's dice pool to another face adjacent to it. An \"adjacent\" face is any die face sharing an edge not a point with the rolled face. Unmatched Fortune cannot be used on a",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "C. Frequency",
        "xp": 10,
        "text": "Unmatched Fortune can be used one additional time each game session per Frequency upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Number",
        "xp": 10,
        "text": "Unmatched Fortune affects one additional die per Increase Number upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Shared Luck",
        "xp": 10,
        "text": "Unmatched Fortune can also be used on the dice pool of a willing ally within short range."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Increase Number",
        "xp": 10,
        "text": "Unmatched Fortune affects one additional die per Increase Number upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Fortune costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Increase Effect",
        "xp": 15,
        "text": "Unmatched Fortune can also be used on negative dice."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Increase Range",
        "xp": 15,
        "text": "Increases the maximum range at which Unmatched Fortune can affect willing allies by 1 per Increase Range upgrade purchased."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Frequency",
        "xp": 15,
        "text": "Unmatched Fortune can be used one additional time each game session per Frequency upgrade purchased."
      }
    ],
    "links": {
      "baseDown": [
        true,
        false,
        false,
        true
      ],
      "row1h": [
        true,
        true,
        true
      ],
      "row2h": [
        false,
        false,
        true
      ],
      "row1to2": [
        true,
        true,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_the_bigger_they_are",
    "name": "The Bigger They Are...",
    "careerKey": "SOLDIER",
    "source": "Forged in Battle 38",
    "page": 131,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an action, the character may spend 2 Destiny Points, nominate one vehicle, starship or living creature of silhouette 2 or smaller that he can see and make a Hard (ddd ) Knowledge (Warfare) check. If he succeeds, for the next 3 rounds, he and each other friendly character within medium range of him ignore the target's armor (or soak) when inflicting damage on the target with non- vehicle/starship weapons.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Silhouette",
        "xp": 10,
        "text": "Increase the silhouette of targets that can be affected by The Bigger They Are... by 1."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Change Skill",
        "xp": 10,
        "text": "May use Survival instead of Knowledge (Warfare) to activate The Bigger They Are..."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Duration",
        "xp": 10,
        "text": "The Bigger They Are... lasts for 2 additional rounds."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "May use Athletics instead of Knowledge (Warfare) to activate The Bigger They Are..."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Ongoing Salvo",
        "xp": 15,
        "text": "If the target is destroyed (or dies) while The Bigger They Are... is active, the character may spend 1 Destiny Point to select a new target for The Bigger They Are..."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "The Bigger They Are... costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "The difficulty of the skill check to activate The Bigger They Are... is Average (dd ) instead of Hard (ddd )."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Increase Silhouette",
        "xp": 15,
        "text": "Increase the silhouette of targets that can be affected by The Bigger They Are... by 1."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        true
      ],
      "row1h": [
        false,
        true,
        false
      ],
      "row2h": [
        true,
        true,
        false
      ],
      "row1to2": [
        false,
        true,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_courage",
    "name": "Unmatched Courage",
    "careerKey": "SOLDIER",
    "source": "Forged in Battle 39",
    "page": 132,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, as an out of turn incidental, the character may spend 2 Destiny Points to ignore the effects of all Critical Injuries for 2 rounds. When this effect ends, he suffers the effects of these Critical Injuries as normal.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Effect",
        "xp": 10,
        "text": "While Unmatched Courage is active, whenever the character would suffer strain, he may suffer that many wounds instead."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Courage lasts for 2 additional rounds per Duration upgrade."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Survivor",
        "xp": 10,
        "text": "While Unmatched Courage is active, add b to checks to remove Critical Injuries."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Duration",
        "xp": 10,
        "text": "Unmatched Courage lasts for 2 additional rounds per Duration upgrade."
      },
      {
        "row": 1,
        "col": 0,
        "name": "See It Through",
        "xp": 15,
        "text": "While Unmatched Courage is active, the character does not become incapacitated when his wounds exceed his wound threshold."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Finish the Job",
        "xp": 15,
        "text": "While Unmatched Courage is active, the character adds +2 damage for each Critical Injury he is suffering to the first hit of each successful combat check he makes."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Survivor",
        "xp": 15,
        "text": "While Unmatched Courage is active, add b to checks to remove Critical Injuries."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Too Tough to Die",
        "xp": 15,
        "text": "When Unmatched Courage ends, make a Hard (ddd ) Resilience check to remove one Critical Injury."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        false
      ],
      "row1h": [
        false,
        true,
        true
      ],
      "row2h": [
        false,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_counterespionage",
    "name": "Counterespionage",
    "careerKey": "SPY",
    "source": "Cyphers and Masks 34",
    "page": 139,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, the character may spend 2 Destiny Points to make an opposed Knowledge (Warfare) vs. Deception check against an identified enemy agent or espionage leader. If successful, the character utterly foils one previously identified ploy or tactic associated with that enemy's act of espionage. The exact nature how character accomplishes this must be approved by the GM, but should be suitably cunning and clever. Note that the enemy character does not need to be physically present or near the character for this ability to be used, and that the GM has final say on which NPCs are valid targets.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Add Boost",
        "xp": 10,
        "text": "When making the skill check to activate Counterespionage, the character adds b per Add Boost upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Change Skill",
        "xp": 10,
        "text": "The skill check the character makes as part of using Counterespionage, can be made using Charm instead of Knowledge (Warfare)."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from the character's skill check as part of using Counterespionage."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "The skill check the character makes as part of using Counterespionage, can be made using Negotiation instead of Knowledge (Warfare)."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Destiny",
        "xp": 15,
        "text": "Counterespionage costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Reduce Setback",
        "xp": 15,
        "text": "Remove b from the character's skill check as part of using Counterespionage."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Add Boost",
        "xp": 15,
        "text": "When making the skill check to activate Counterespionage, the character adds b per Add Boost upgrade."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Turn Agent",
        "xp": 15,
        "text": "Spend x on a successful check to activate Counterespionage to turn one identified enemy agent into a double agent secretly working for the character."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        true
      ],
      "row1h": [
        false,
        false,
        false
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        false,
        true,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unmatched_tradecraft",
    "name": "Unmatched Tradecraft",
    "careerKey": "SPY",
    "source": "Cyphers and Masks 35",
    "page": 140,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per session as an incidental, after the player rolls the dice for a Deception, but before resolving the results, he may spend 2 Destiny Points to remove one of the rolled d from the pool. The results from that d are ignored, and the check is then resolved as normal.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Increase Effect",
        "xp": 10,
        "text": "Unmatched Tradecraft may also be used on b."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Number",
        "xp": 10,
        "text": "The number of dice removed through Unmatched Tradecraft increases by one per Increase Number upgrade."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Change Skill",
        "xp": 10,
        "text": "Unmatched Tradecraft may also be used with the Stealth skill instead of Deception."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Change Skill",
        "xp": 10,
        "text": "Unmatched Tradecraft may also be used with the Skulduggery skill instead of Deception."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Increase Effect",
        "xp": 15,
        "text": "Unmatched Tradecraft may also be used on c."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Tradecraft costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Frequency",
        "xp": 15,
        "text": "Unmatched Tradecraft can be used twice per game session."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Increase Number",
        "xp": 15,
        "text": "The number of dice removed through Unmatched Tradecraft increases by one per Increase Number upgrade."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        false,
        true
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_inventive_creation",
    "name": "Inventive Creation",
    "careerKey": "TECHNICIAN",
    "source": "Special Modifications 39",
    "page": 147,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, as an action, the character may spend 2 Destiny Points and make a Daunting (dddd ) Mechanics check. If he succeeds, the character immediately uses available parts to build a device that functions as an item of his choice with a rarity of 5 or lower. The item functions until the end of the encounter, at which point it falls apart, shorts out, or otherwise ceases to function permanently. The exact nature of the device the character is trying to construct, as well as the end results, must be approved by the GM (see Narrative Abilities on SM38).",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Inventive Creation."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Rarity",
        "xp": 10,
        "text": "Increase the rarity of the device the character can build by 1."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Reduce Setback",
        "xp": 10,
        "text": "Remove b from skill check to activate Inventive Creation."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Increase Rarity",
        "xp": 10,
        "text": "Increase the rarity of the device the character can build by 1."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Reduce Difficulty",
        "xp": 15,
        "text": "Reduce the difficulty of the skill check to activate Inventive Creation to Hard ( ddd )."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Increase Rarity",
        "xp": 15,
        "text": "Increase the rarity of the device the character can build by 1."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Destiny",
        "xp": 15,
        "text": "Inventive Creation costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Change Scale",
        "xp": 15,
        "text": "May create a vehicle of silhouette 2 or smaller using Inventive Creation."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        false,
        true
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unmatched_calibration",
    "name": "Unmatched Calibration",
    "careerKey": "TECHNICIAN",
    "source": "Special Modifications 40",
    "page": 148,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session as an incidental, the character may spend 2 Destiny Points to re-roll up to two dice in the character's dice pool. Unmatched Calibration cannot he used on a",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "C. Reduce Setback",
        "xp": 10,
        "text": "May remove b instead of re- rolling it."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Increase Number",
        "xp": 10,
        "text": "Unmatched Calibration affects one additional die per Increase Number upgrade purchased."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Frequency",
        "xp": 10,
        "text": "Unmatched Calibration can be used one additional time each game session per Frequency upgrade purchased."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Increase Number",
        "xp": 10,
        "text": "Unmatched Calibration affects one additional die per Increase Number upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Calibration costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Minimize Risk",
        "xp": 15,
        "text": "Downgrade one c to be re- rolled with Unmatched Calibration to d ."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Optimization",
        "xp": 15,
        "text": "Upgrade one d to be re- rolled with Unmatched Calibration to c."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Shared Acumen",
        "xp": 15,
        "text": "Unmatched Calibration can also be used on the dice pool of a willing ally within short range."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        true,
        false,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_this_one_is_mine",
    "name": "This One is Mine",
    "careerKey": "THEACE",
    "source": "Stay on Target 36",
    "page": 7,
    "nodes": [
      true,
      false,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per game session, when piloting a starship or vehicle, the character may spend 2 Destiny Points to challenge another starship or vehicle in the battle with equal silhouette. For 2 rounds, the two ships are locked in a duel. For the duration of the duel, the two dueling ships can only make attacks targeting each other, and no other starships or characters can target the dueling ships with attacks.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Change Silhouette",
        "xp": 10,
        "text": "This One is Mine can target ships or vehicle with a silhouette 1 higher or lower per Change Silhouette upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Duration",
        "xp": 10,
        "text": "This One is Mine lasts for 1 additional round per Duration upgrade."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Duration",
        "xp": 10,
        "text": "This One is Mine lasts for 1 additional round per Duration upgrade."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Evasion",
        "xp": 10,
        "text": "Upgrade the difficulty of all incoming attacks once per Evasion upgrade while This One is Mine is active."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Change Silhouette",
        "xp": 15,
        "text": "This One is Mine can target ships or vehicle with a silhouette 1 higher or lower per Change Silhouette upgrade."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Frequency",
        "xp": 15,
        "text": "This One is Mine may be used twice per game session."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Destiny",
        "xp": 15,
        "text": "This One is Mine costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Evasion",
        "xp": 15,
        "text": "Upgrade the difficulty of all incoming attacks once per Evasion upgrade while This One is Mine is active."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        false,
        true
      ],
      "row1h": [
        false,
        true,
        false
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        true,
        true
      ]
    }
  },
  {
    "key": "sig_unmatched_survivability",
    "name": "Unmatched Survivability",
    "careerKey": "THEACE",
    "source": "Stay on Target 37",
    "page": 8,
    "nodes": [
      true,
      true,
      false,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per game session, when piloting a starship or vehicle with a silhouette of 3 or less that is crippled (has hull trauma in excess of it's hull trauma threshold), the character may spend 2 Destiny Points as an incidental. The starship or vehicle operates as if it is not crippled for the next 3 rounds, acting as if its hull trauma is equal to its hull trauma threshold.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Change Silhouette",
        "xp": 10,
        "text": "Unmatched Survivability affects ships or vehicles with 1 greater silhouette per Change Silhouette upgrade."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Frequency",
        "xp": 10,
        "text": "Unmatched Survivability may be used twice per game session."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Durability",
        "xp": 10,
        "text": "Reduce Critical Hits suffered by the ship or vehicle by 10 per Durability upgrade while Unmatched Survivability is active."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Durability",
        "xp": 10,
        "text": "Reduce Critical Hits suffered by the ship or vehicle by 10 per Durability upgrade while Unmatched Survivability is active."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Change Silhouette",
        "xp": 15,
        "text": "Unmatched Survivability affects ships or vehicles with 1 greater silhouette per Change Silhouette upgrade."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Survivability costs 1 Destiny Point instead of 2."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Duration",
        "xp": 15,
        "text": "Unmatched Survivability lasts until the end of the encounter."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Reinforcement",
        "xp": 15,
        "text": "The Critical Rating of all weapons targeting the ship or vehicle counts as 1 higher while Unmatched Survivability is active."
      }
    ],
    "links": {
      "baseDown": [
        true,
        true,
        true,
        false
      ],
      "row1h": [
        false,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        true,
        false,
        true
      ]
    }
  },
  {
    "key": "sig_deadly",
    "name": "Deadly",
    "careerKey": "WAR",
    "source": "BY REPUTATION Knights of Fate 34",
    "page": 155,
    "nodes": [
      false,
      true,
      true,
      false
    ],
    "baseXp": 30,
    "baseText": "Once per session as an incidental, the character may spend 2 Destiny Points to activate Deadly Reputation. Until the end of the character's next turn, increase the difficulty of all skill checks targeting the character by one.",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Duration",
        "xp": 10,
        "text": "Deadly Reputation lasts for one additional turn per Duration upgrade purchased."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Deadly by Association",
        "xp": 10,
        "text": "Deadly by Reputation also affect check targeting the character's allies."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Add Setback",
        "xp": 10,
        "text": "Add b per Add Setback upgrades purchased to checks affected by Deadly Reputation"
      },
      {
        "row": 0,
        "col": 3,
        "name": "Duration",
        "xp": 10,
        "text": "Deadly Reputation lasts for one additional turn per Duration upgrade purchased."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Increase Effect",
        "xp": 15,
        "text": "Upgrade the difficulty of checks affected by Deadly Reputation once."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Add Setback",
        "xp": 15,
        "text": "Add b per Add Setback upgrades purchased to checks affected by Deadly Reputation"
      },
      {
        "row": 1,
        "col": 2,
        "name": "Destiny",
        "xp": 15,
        "text": "Deadly Reputation costs 1 fewer Destiny Point to activate."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Duration",
        "xp": 15,
        "text": "Deadly Reputation lasts for one additional turn per Duration upgrade purchased."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        false,
        true
      ],
      "row1to2": [
        false,
        true,
        true,
        false
      ]
    }
  },
  {
    "key": "sig_unmatched_ferocity",
    "name": "Unmatched Ferocity",
    "careerKey": "WAR",
    "source": "Knights of Fate 35",
    "page": 156,
    "nodes": [
      false,
      true,
      false,
      true
    ],
    "baseXp": 30,
    "baseText": "Once per session after resolving a successful Melee combat check against a target engaged with the character, the character may spend 2 Destiny Points. The character then suffers 4 strain and 1 Conflict to immediately make a Melee attack as an incidental against the same target, increasing the difficulty of the check by one, to a maximum difficulty of Formidable (ddddd ). If successful. the character may repeat the process (suffering further strain and Conflict).",
    "upgrades": [
      {
        "row": 0,
        "col": 0,
        "name": "Reduce Strain",
        "xp": 10,
        "text": "Reduce the strain suffered to make additional attacks by 1."
      },
      {
        "row": 0,
        "col": 1,
        "name": "Change Skill",
        "xp": 10,
        "text": "The character may activate Unmatched Ferocity after a successful Brawl check."
      },
      {
        "row": 0,
        "col": 2,
        "name": "Change Skill",
        "xp": 10,
        "text": "The character may activate Unmatched Ferocity after a successful Lightsaber check."
      },
      {
        "row": 0,
        "col": 3,
        "name": "Reduce Strain",
        "xp": 10,
        "text": "Reduce the strain suffered to make additional attacks by 1."
      },
      {
        "row": 1,
        "col": 0,
        "name": "Destiny",
        "xp": 15,
        "text": "Unmatched Ferocity costs 1 fewer Destiny Point to activate."
      },
      {
        "row": 1,
        "col": 1,
        "name": "Change Target",
        "xp": 15,
        "text": "The character may choose a different target for each attack made as a result of Unmatched Ferocity."
      },
      {
        "row": 1,
        "col": 2,
        "name": "Reduce Conflict",
        "xp": 15,
        "text": "The character may choose to suffer an additional 2 strain instead of 1 Conflict to activate Unmatched Ferocity."
      },
      {
        "row": 1,
        "col": 3,
        "name": "Reduce Strain",
        "xp": 15,
        "text": "Reduce the strain suffered to make additional attacks by 1."
      }
    ],
    "links": {
      "baseDown": [
        false,
        true,
        true,
        false
      ],
      "row1h": [
        true,
        false,
        true
      ],
      "row2h": [
        true,
        true,
        true
      ],
      "row1to2": [
        true,
        false,
        false,
        true
      ]
    }
  }
];
