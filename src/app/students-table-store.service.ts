import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IStudent } from './interfaces/student.interface';
import { IRule } from './interfaces/rule.interface';
import { ITableData } from './interfaces/table-data.interface';
import { MOCK_STUDENTS } from './mocks/mock-students';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsTableStoreService {

  constructor() { }

  private readonly _students: BehaviorSubject<IStudent[]> = new BehaviorSubject<IStudent[]>(undefined);
  private readonly _rule: BehaviorSubject<IRule> = new BehaviorSubject<IRule>(undefined);
  private readonly _studentsTableData: BehaviorSubject<ITableData> = new BehaviorSubject<ITableData>(undefined);
  private readonly _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);

  public readonly rule$: Observable<IRule> = this._rule.asObservable();
  public readonly studentsTableData$: Observable<ITableData> = this._studentsTableData.asObservable();
  public readonly loading$: Observable<boolean> = this._loading.asObservable();

  // The getters will return the last value emitted in subject
  private get students(): IStudent[] {
    return this._students.getValue();
  }
  private get rule(): IRule {
    return this._rule.getValue();
  }
  private get studentsTableData(): ITableData {
    return this._studentsTableData.getValue();
  }
  private get loading(): boolean {
    return this._loading.getValue();
  }

  // The setters will emit a new value and push it onto the observable and down to its subscribers
  private set students(value: IStudent[]) {
    this._students.next(value);
  }
  private set rule(value: IRule) {
    this._rule.next(value);
  }
  private set studentsTableData(value: ITableData) {
    this._studentsTableData.next(value);
  }
  private set loading(value: boolean) {
    this._loading.next(value);
  }

  // Actions
  loadInitialData(): void {
    this.loading = true;

    // Use delay to simulate response time
    of(MOCK_STUDENTS).pipe(delay(1500))
      .subscribe((students) => {
        this.students = students;
        this.formatStudentTableDataWithRule(students);
        this.loading = false;
      });
  }

  setRule(ruleFormParams: IRule): void {
    this.loading = true;
    this.rule = ruleFormParams;

    if (this.rule.saveInBrowser) {
      localStorage.setItem('colorRule', JSON.stringify(ruleFormParams));
    } else if (!!localStorage.getItem('colorRule')) {
      localStorage.removeItem('colorRule');
    }

    this.formatStudentTableDataWithRule(this.students);
    this.loading = false;
  }

  resetRule(): void {
    this.rule = undefined;
    this.loading = true;
    if (!!localStorage.getItem('colorRule')) {
      localStorage.removeItem('colorRule');
    }
    this.formatStudentTableDataWithRule(this.students);
    this.loading = false;
  }

  // Functions
  formatStudentTableDataWithRule(students: IStudent[]): void {
    // If no rule in store, check localStorage and assign it if present
    if (!this.rule && localStorage.getItem('colorRule')) {
      this.rule = JSON.parse(localStorage.getItem('colorRule'));
    }

    // Apply the color rule to the student data to set studentsTableData
    const rows = students.map(student => {
      let highlightColor = '';

      if (!!this.rule) {
        const conditionAsArray = this.rule.condition.replace(/['"]+/g, '')
          .toLowerCase().split(' ').filter(x => x !== '');

        const [column, operator, value] = conditionAsArray.length > 3
          ? [conditionAsArray[0], conditionAsArray[1], conditionAsArray.slice(2).join(' ')]
          : conditionAsArray;

        if (student.hasOwnProperty(column)) {
          switch (operator) {
            case '=':
              if ((typeof student[column] === 'string' && student[column].toLowerCase() === value.toLowerCase())
                || (typeof student[column] === 'number' && student[column] === parseInt(value))
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case '!=':
              if ((typeof student[column] === 'string' && student[column].toLowerCase() !== value.toLowerCase())
                || (typeof student[column] === 'number' && student[column] !== parseInt(value))
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case '>':
              if (typeof student[column] === 'number'
                && typeof parseInt(value) === 'number'
                && student[column] > parseInt(value)
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case '<':
              if (typeof student[column] === 'number'
                && typeof parseInt(value) === 'number'
                && student[column] < parseInt(value)
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case '>=':
              if (typeof student[column] === 'number'
                && typeof parseInt(value) === 'number'
                && student[column] >= parseInt(value)
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case '<=':
              if (typeof student[column] === 'number'
                && typeof parseInt(value) === 'number'
                && student[column] <= parseInt(value)
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case 'contains':
              if ((typeof student[column] === 'string' && student[column].toLowerCase().indexOf(value) > -1)
                || (Array.isArray(student[column]) && student[column].join(' ').toLowerCase().split(' ').indexOf(value) > -1)
              ) {
                highlightColor = this.rule.color;
              }
              break;
            case '!contains':
              if ((typeof student[column] === 'string' && student[column].toLowerCase().indexOf(value) === -1)
                || (Array.isArray(student[column]) && student[column].join(' ').toLowerCase().split(' ').indexOf(value) === -1)
              ) {
                highlightColor = this.rule.color;
              }
              break;
            default:
              break;
          }
        }
      }

      return {
        ...student,
        allergies: student.allergies.length ? student.allergies.join(', ') : '',
        highlightColor
      };
    });

    this.studentsTableData = {
      columns: Object.keys(students[0]),
      rows
    };
  }
}
