import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StudentsTableStoreService } from './students-table-store.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Context menu settings
  showContextMenu = false;
  contextMenuX: number;
  contextMenuY: number;

  // Rule form modal settings
  showModal = false;

  @ViewChild('modal', {static: false}) modal: ModalComponent;

  // Close context menu on click
  @HostListener('document:click')
  documentClicked(): void {
    if (this.showContextMenu) {
      this.hideContextMenuHandler();
    }
  }

  constructor(public studentsTableStoreService: StudentsTableStoreService) {}

  ngOnInit(): void {
    this.studentsTableStoreService.loadInitialData();
  }

  resetRuleHandler(): void {
    this.studentsTableStoreService.resetRule();
  }

  openModalHandler(): void {
    this.showModal = true;
    this.hideContextMenuHandler();
  }

  closeModalHandler(): void {
    this.showModal = false;
  }

  showContextMenuHandler(event: MouseEvent): void {
    // Prevent default browser action from the event
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.showContextMenu = true;
  }

  hideContextMenuHandler(): void {
    this.showContextMenu = false;
    this.contextMenuX = undefined;
    this.contextMenuY = undefined;
  }
}

