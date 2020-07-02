import {Injectable} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Repository} from './repository';
import { filter } from 'rxjs/operators';

@Injectable()
export class NavigationService {

  constructor(private repo: Repository, private router: Router, private active: ActivatedRoute) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => this.handleNavigationChange());
  }

  private handleNavigationChange() {
    const active = this.active.firstChild.snapshot;
    if (active.url.length > 0 && active.url[0].path === 'store') {
      if (active.params.categoryOrPage !== undefined) {
        const value = Number.parseInt(active.params.categoryOrPage);
        if (!Number.isNaN(value)) {
          this.repo.filter.category = '';
          this.repo.paginationObject.currentPage = value;
        } else {
          this.repo.filter.category
            = active.params.categoryOrPage;
          this.repo.paginationObject.currentPage = 1;
        }
      } else {
        const category = active.params.category;
        this.repo.filter.category = category || '';
        this.repo.paginationObject.currentPage
          = Number.parseInt(active.params.page) || 1;
      }
      this.repo.getProducts();
    }
  }

  get categories(): string[] {
    return this.repo.categories;
  }

  get currentCategory(): string {
    return this.repo.filter.category || '';
  }

  set currentCategory(newCat: string) {
    this.router.navigateByUrl(`/store/${(newCat || '').toLowerCase()}`);
  }

  get currentPage(): number {
    return this.repo.paginationObject.currentPage;
  }

  set currentPage(newPage: number) {
    if (this.currentCategory === '') {
      this.router.navigateByUrl(`/store/${newPage}`);
    } else {
      this.router.navigateByUrl(`/store/${this.currentCategory}/${newPage}`);
    }
  }

  get productsPerPage(): number {
    return this.repo.paginationObject.productsPerPage;
  }

  get productCount(): number {
    return (this.repo.products || []).length;
  }
}
