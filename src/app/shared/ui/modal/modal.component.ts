import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Output() onClose = new EventEmitter<void>();

  private readonly doc = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);

  private anchor: Comment | null = null;
  private static openModalCount = 0;

  readonly X = X;

  ngAfterViewInit(): void {
    this.moveHostToBody();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.syncBodyScrollLock();
    }
  }

  ngOnDestroy(): void {
    this.restoreHost();
    this.setBodyScrollLocked(false);
  }

  getPanelClasses(): string[] {
    const widthBySize: Record<typeof this.size, string> = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-6xl',
    };

    return [widthBySize[this.size]];
  }

  close(): void {
    this.onClose.emit();
  }

  private moveHostToBody(): void {
    const el = this.host.nativeElement;
    const parent = el.parentNode;

    if (!parent || el.parentNode === this.doc.body) {
      return;
    }

    this.anchor = this.doc.createComment('app-modal-anchor');
    parent.insertBefore(this.anchor, el);
    this.doc.body.appendChild(el);
  }

  private restoreHost(): void {
    const el = this.host.nativeElement;

    if (this.anchor?.parentNode) {
      this.anchor.parentNode.insertBefore(el, this.anchor);
      this.anchor.remove();
      this.anchor = null;
      return;
    }

    el.remove();
  }

  private syncBodyScrollLock(): void {
    if (this.isOpen) {
      ModalComponent.openModalCount += 1;
    } else if (ModalComponent.openModalCount > 0) {
      ModalComponent.openModalCount -= 1;
    }

    this.setBodyScrollLocked(ModalComponent.openModalCount > 0);
  }

  private setBodyScrollLocked(locked: boolean): void {
    this.doc.body.classList.toggle('modal-scroll-lock', locked);
  }
}
