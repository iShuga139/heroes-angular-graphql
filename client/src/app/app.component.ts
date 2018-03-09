import 'rxjs/add/operator/map';
import { Apollo } from 'apollo-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { GraphqlService } from './graphql.service';
import { Sidekick } from './entity/sidekick';
import { Hero } from './entity/hero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Heroes App';
  heroes: Array<Hero> = [];
  hero: Hero;
  sidekick: Sidekick;

  modalRef: BsModalRef;

  constructor(private apollo: Apollo,
              private gqlService: GraphqlService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.apollo.watchQuery<any>({ query: this.gqlService.getHeroes()})
      .valueChanges
      .subscribe((result) => {
        this.heroes = result.data.heroes;
      });
  }

  createHero(heroVals, sidekickVals) {
    this.apollo
      .mutate({
        mutation: this.gqlService.saveHero(),
        variables: {
          name: heroVals.name,
          power: heroVals.power,
          status: heroVals.status && heroVals.status === 'true' ? true : false
        }
      })
      .subscribe(({ data: { createHero } }) => {
        this.apollo
          .mutate({
            mutation: this.gqlService.saveSidekick(),
            variables: {
              name: sidekickVals.name,
              heroId: createHero._id,
              status: sidekickVals.status && sidekickVals.status === 'true' ? true : false
            },
            update: (proxy, { data: { createSidekick } }) => {
              const data: any = proxy.readQuery({ query: this.gqlService.getHeroes() });
              createHero.sidekick = createSidekick;
              data.heroes.push(createHero);
              proxy.writeQuery({ query: this.gqlService.getHeroes(), data });
            }
          })
          .subscribe(({ dataX }) => {
            this.closeFirstModal();
          }, (error) => {
            console.log('there was an error sending the sidekick query', error);
          });
      }, (error) => {
        console.log('there was an error sending the hero query', error);
      });
  }

  openModal(template: TemplateRef<any>) {
    this.hero = new Hero();
    this.sidekick = new Sidekick();
    this.modalRef = this.modalService.show(template);
  }

  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
