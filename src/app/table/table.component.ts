import { Component, OnInit, Input } from '@angular/core';
import { ITableData } from '../interfaces/table-data.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: ITableData;

  constructor() { }

  ngOnInit(): void {
  }

}
