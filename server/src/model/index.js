export const typeDefs = [`
  type Hero {
    _id: String
    name: String
    power: String
    status: Boolean
    sidekick: Sidekick
  }

  type Sidekick {
    _id: String
    name: String
    status: Boolean
    heroId: String
  }

  type Query {
    hero(_id: String): Hero
    heroes: [Hero]
    sidekick(_id: String): Sidekick
    sidekicks: [Sidekick]
  }

  type Mutation {
    createHero(name: String, power: String, status: Boolean): Hero
    updateHero(_id: String, name: String, power: String, status: Boolean): Hero
    removeHero(_id: String): Hero

    createSidekick(name: String status: Boolean, heroId: String): Sidekick
    updateSidekick(_id: String, name: String, status: Boolean, heroId: String): Sidekick
    removeSidekick(_id: String): Sidekick
  }

  schema {
    query: Query
    mutation: Mutation
  }
`]