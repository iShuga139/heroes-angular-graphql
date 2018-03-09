import { ObjectId } from "mongodb";

export const schemaResolve = db => {
  const Hero = db.collection("hero");
  const Sidekick = db.collection("sidekick");

  const prepare = object => {
    if (object) {
      object._id = object._id.toString();
      return object;
    }

    return;
  };

  return {
    Query: {
      hero: async (root, { _id }) => {
        return prepare(await Hero.findOne(ObjectId(_id)));
      },
      heroes: async () => {
        return (await Hero.find({}).toArray()).map(prepare);
      },
      sidekick: async (root, { _id }) => {
        return prepare(await Sidekick.findOne(ObjectId(_id)));
      },
      sidekicks: async () => {
        return (await Sidekick.find({}).toArray()).map(prepare);
      }
    },
    Hero: {
      sidekick: async ({ _id }) => {
        return prepare(await Sidekick.findOne({ heroId: _id }));
      }
    },
    Mutation: {
      createHero: async (root, args, context, info) => {
        const res = await Hero.insert(args);
        return prepare(await Hero.findOne({ _id: res.insertedIds[0] }));
      },
      updateHero: async (root, { _id, name, power, status }, context, info) => {
        const res = await Hero.findOneAndUpdate(
          { _id: ObjectId(_id) },
          {
            $set: { name, power, status }
          }
        );
        if (res.lastErrorObject.updatedExisting) {
          return prepare({ _id });
        }

        return;
      },
      removeHero: async (root, { _id }, context, info) => {
        const res = await Hero.deleteOne({ _id: ObjectId(_id) });
        if (res.deletedCount === 1) {
          await Sidekick.deleteOne({ heroId: ObjectId(_id) });
          return prepare({ _id });
        }

        return;
      },
      createSidekick: async (root, args, context, info) => {
        const res = await Sidekick.insert(args);
        return prepare(await Sidekick.findOne({ _id: res.insertedIds[0] }));
      },
      updateSidekick: async (
        root,
        { _id, name, status, heroId },
        context,
        info
      ) => {
        const res = await Sidekick.findOneAndUpdate(
          { _id: ObjectId(_id) },
          {
            $set: { name, status, heroId }
          }
        );
        if (res.lastErrorObject.updatedExisting) {
          return prepare({ _id });
        }

        return;
      },
      removeSidekick: async (root, args, context, info) => {
        const res = await Sidekick.insert(args);
        return prepare(await Sidekick.findOne({ _id: res.insertedIds[0] }));
      }
    }
  };
};
