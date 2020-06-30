import {Injectable} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {Repository} from "./repository";
import { filter } from 'rxjs/operators';

@Injectable()
export class NavigationService {

  constructor(private repo: Repository, private router: Router, private active: ActivatedRoute) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => this.handleNavigationChange());
  }

  private handleNavigationChange() {
    const active = this.active.firstChild.snapshot;
    if (active.url.length > 0 && active.url[0].path == 'store') {
      let category = active.params['category'];
      this.repo.filter.category = category || "";
      this.repo.getProducts();
    }
  }

  get categories(): string[] {
    return this.repo.categories;
  }

  get currentCategory(): string {
    return this.repo.filter.category || "";
  }

  set currentCategory(newCat: string) {
    this.router.navigateByUrl(`/store/${(newCat || "").toLowerCase()}`);
  }

}
