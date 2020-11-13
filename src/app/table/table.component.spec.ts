import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { By } from '@angular/platform-browser';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an element for each row in table data', () => {
    component.data = {
      columns: ['name', 'age', 'gender', 'country', 'language', 'allergies'],
      rows: [
        { highlightColor: '', name: 'John Snow', age: 14, gender: 'Male', country: 'USA', language: 'English', allergies: [] },
        { highlightColor: '', name: 'Val Rives', age: 12, gender: 'Female', country: 'Canada', language: 'French', allergies: ['Peanuts'] }
      ]
    };

    const compiled = fixture.debugElement;
    fixture.detectChanges();
    expect(compiled.queryAll(By.css('.table-row')).length).toEqual(component.data.rows.length);
  });
});
