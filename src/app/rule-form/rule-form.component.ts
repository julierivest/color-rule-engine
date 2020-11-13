import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentsTableStoreService } from '../students-table-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IRule } from '../interfaces/rule.interface';

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent implements OnInit, OnDestroy {
  ruleForm: FormGroup;
  colorOptions = [
    { name: 'Red', value: '#fc8b8b' },
    { name: 'Yellow', value: '#fafc83' },
    { name: 'Green', value: '#afff9c' },
    { name: 'Blue', value: '#b0edff' }
  ];

  @Output() closeModal = new EventEmitter();

  destroy$ = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private studentsTableStoreService: StudentsTableStoreService
  ) { }

  ngOnInit(): void {
    this.studentsTableStoreService.rule$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rule) => this.setRuleForm(rule));
  }

  setRuleForm(rule: IRule): void {
    this.ruleForm = this.formBuilder.group({
      condition: [
        rule ? rule.condition : '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+\s(=|!=|>|<|>=|<=|contains|!contains)\s.{1,}$/)]
      ],
      color: [rule ? rule.color : '', Validators.required],
      saveInBrowser: [rule ? rule.saveInBrowser : false]
    });
  }

  onSubmit(): void {
    this.studentsTableStoreService.setRule(this.ruleForm.value);
    this.closeModal.next();
  }

  onCancel(): void {
    this.closeModal.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

