import { Utils } from "./utils";

(async () => {

let client = Utils.getClient()

const apps = [
    {
      name: 'famILY',
      description: 'Family collaboration app',
      features: [
        'Shared account data',
        'Family meals',
        'Events',
        'Group Messaging',
        'Households visualization',
      ],
      founder: 'Mark',
      timeline: [
        {
          status: 'Minimum Viable Product',
          isProgress: true,
          isDone: false,
        },
        {
          status: 'User Growth',
          isProgress: false,
          isDone: false,
        },
        {
          status: 'Revenue',
          isProgress: false,
          isDone: false,
        },
        {
          status: 'Profitability',
          isProgress: false,
          isDone: false,
        },
      ],
    },
    {
      name: 'Make Me Up',
      description: '3D Interactive Makeup Visualization',
      features: [
        '3D interactive head model',
        'Techniques for Blush, Eyes, Lips, Contouring, Highlights, Bronzing',
      ],
      founder: 'Mark'
    },
    {
      name: 'Bioscope',
      description: 'Personality trait dating',
      features: [
        'Connect 23 & Me account',
        'Compatibility algorithm based off 5 Major Personality types with scaling',
      ],
      founder: 'Mark'
    },
    {
      name: 'Smart Dog',
      description: 'Smart dog wearable technology',
      founder: 'Mark'
    },
    {
      name: 'NFTropolis',
      founder: 'Marcus'
    },
    {
      name: 'Flypto',
      founder: 'Marcus'
    },
    {
      name: 'Profile Dating',
      founder: 'Marcus'
    },
    {
      name: "We 'ed",
      founder: 'Maria'
    },
    {
      name: 'Notice Me',
      description: 'Fashion Critique and opinions',
      features: [
        'Free tier: anonymous public critique',
        'Premium tier: curated, specializted stylist critique',
      ],
      founder: 'Robert'
    },
  ]

await client.connect()
await client.db("GirlCode").collection("Apps").insertMany(apps);
})()