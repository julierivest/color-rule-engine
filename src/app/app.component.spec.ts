import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StudentsTableStoreService } from './students-table-store.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let studentsTableStoreService: StudentsTableStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: StudentsTableStoreService, useClass: StudentsTableStoreServiceMock }
      ]
    }).compileComponents();

    studentsTableStoreService = TestBed.inject(StudentsTableStoreService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should call loadInitialData() on init', () => {
    app.ngOnInit();
    expect(studentsTableStoreService.loadInitialData).toHaveBeenCalled();
  });

  it('should reset the rule on reset button click', fakeAsync(() => {
    spyOn(app, 'resetRuleHandler');
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();
    expect(app.resetRuleHandler).toHaveBeenCalled();
  }));
});

class StudentsTableStoreServiceMock {
  loading$ = of(false);
  rule$ = of({
    condition: 'Age = 12',
    color: '#fafc83',
    saveInBrowser: false
  });
  loadInitialData = jasmine.createSpy('loadInitialData');
  resetRule = jasmine.createSpy('resetRule');
}
