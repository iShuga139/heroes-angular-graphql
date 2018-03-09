import { Injectable } from '@angular/core';

import gql from 'graphql-tag';

import { Hero } from './entity/hero';
import { Sidekick } from './entity/sidekick';

@Injectable()
export class GraphqlService {

  constructor() { }

  getHero(): Hero {
    return gql`
      query {
        hero {
          _id
          name
          power
          status
          sidekick {
            _id
            name
            status
          }
        }
      }`;
  }

  getHeroes(): Hero[] {
    return gql`
      query {
        heroes {
          _id
          name
          power
          status
          sidekick {
            _id
            name
            status
          }
        }
      }`;
  }

  getSidekick(): Sidekick {
    return gql`
      query {
        sidekick {
          _id
          name
          status
        }
      }`;
  }

  getSidekicks(): Sidekick[] {
    return gql`
      query {
        sidekicks {
          _id
          name
          status
        }
      }`;
  }

  saveHero(): Hero {
    return gql`
      mutation createHero($name: String!, $power: String!, $status: Boolean!) {
        createHero(name: $name, power: $power, status: $status) {
          _id
          name
          power
          status
        }
      }
    `;
  }

  saveSidekick(): Sidekick {
    return gql`
      mutation createSidekick($name: String!, $status: Boolean!, $heroId: String!) {
        createSidekick(name: $name, status: $status, heroId: $heroId) {
          _id
          name
          status
        }
      }
    `;
  }
}
