import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @Input() menuItem: string;
  @Input() x = 0;
  @Input() y = 0;

  @Output() menuItemClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
