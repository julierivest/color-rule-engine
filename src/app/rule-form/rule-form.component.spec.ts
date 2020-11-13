import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RuleFormComponent } from './rule-form.component';
import { StudentsTableStoreService } from '../students-table-store.service';
import { of } from 'rxjs';
import { IRule } from '../interfaces/rule.interface';

describe('RuleFormComponent', () => {
  let component: RuleFormComponent;
  let fixture: ComponentFixture<RuleFormComponent>;
  let studentsTableStoreService: StudentsTableStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleFormComponent ],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [{ provide: StudentsTableStoreService, useClass: StudentsTableStoreServiceMock }]
    })
    .compileComponents();

    studentsTableStoreService = TestBed.inject(StudentsTableStoreService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the rule from the store and initialize the rule form', (done) => {
    spyOn(component, 'setRuleForm');
    let rule: IRule;

    studentsTableStoreService.rule$.subscribe((data) => {
      rule = data;
      expect(data).toEqual({
        condition: 'Age = 12',
        color: '#fafc83',
        saveInBrowser: false
      });
      expect(component.ruleForm.value).toEqual(rule);
      expect(component.ruleForm.valid).toBeTruthy();
      done();
    });
  });

  it('should update the rule in the store on submit', () => {
    component.onSubmit();
    expect(studentsTableStoreService.setRule).toHaveBeenCalled();
  });
});

class StudentsTableStoreServiceMock {
  rule$ = of({
    condition: 'Age = 12',
    color: '#fafc83',
    saveInBrowser: false
  });
  setRule = jasmine.createSpy('setRule');
}
