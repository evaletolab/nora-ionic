import { Component, Input } from '@angular/core';

@Component({
  selector: 'ion-categories',
  template: `
    <ion-grid class="ion-categories-container">
      <ion-row *ngFor="let row of getCategoriesMatrix()">
        <ion-col 
          *ngFor="let category of row" 
          class="ion-category"
          [ngStyle]="{
            'background': category.background
          }"
          [attr.width-25]="getWidthClass() === 'width-25' ? true : null"
          [attr.width-33]="getWidthClass() === 'width-33' ? true : null"
          [attr.width-50]="getWidthClass() === 'width-50' ? true : null"
          (click)="onClick(category)"
        >
          <div class="overlay" *ngIf="hasOverlay(category)"></div>
          <div class="content-wrapper">
            <h4>{{category.title}}</h4>
            <p *ngIf="category.description">{{category.description}}</p>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: [`
    ion-grid,
    ion-col {
      padding: 0;
    }
    ion-col {
      height: 180px;
      position: relative;
    }
    .overlay,
    .content-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    .overlay {
      background-color: rgba(0, 0, 0, .35);
    }
    .content-wrapper {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .content-wrapper h4, 
    .content-wrapper p {
      margin: 0;
      color: #fff;
    }
    .content-wrapper p {
      color: #efefef;
    }
  `]
})
export class IonCategories {
  @Input() categories: Array<IonCategory> = [];

  @Input() categoriesPerRow: number = 2;

  constructor() { }

  ngOnInit() {
    if (this.categories === undefined || this.categories === null) {
      console.error('[IonCategories] categories are not defined.');
      return;
    }
  }

  onClick(category: IonCategory): void {
    category.onClick && category.onClick(category);
  }

  hasOverlay(category: IonCategory): boolean {
    return category.hasOverlay !== false;
  }

  getCategoriesPerRow(): number {
    return this.categoriesPerRow;
  }

  getCategoriesMatrix(): Array<Array<IonCategory>> {
    return this.categories.reduce((acc, category, currentIndex) => {
      if (currentIndex % this.getCategoriesPerRow() == 0 && currentIndex !== 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(category);
      return acc;
    }, [[]]);
  }

  getWidthClass() : string {
    let categoriesPerRow = this.getCategoriesPerRow();
    if (categoriesPerRow === 2) {
      return 'width-50';
    } else if (categoriesPerRow === 3) {
      return 'width-33';
    } else if (categoriesPerRow === 4) {
      return 'width-25';
    }
    return null;
  }
}

export interface IonCategory {
  key?: string,
  title: string,
  description?: string,
  background?: string,
  onClick?: Function,
  hasOverlay?: boolean
}
