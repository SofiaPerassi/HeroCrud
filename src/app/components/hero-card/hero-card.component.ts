import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/Hero';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../delete/delete.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss'
})
export class HeroCardComponent implements OnInit{

  @Input() hero: any;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Hero>();

  constructor(private router: Router, private service: HeroesService, private dialog: MatDialog, private message: MessageService){}

  ngOnInit(): void {
  }

  editHero(id: string, name: string, description: string){
    this.router.navigate(['/create'], { queryParams: { id: id, name: name, description: description } });
  }

  deleteHero(heroId: string): void {
    const dialogRef = this.dialog.open(DeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteHero(heroId).subscribe({
          next: (val: any) => {
            this.delete.emit(heroId);   
          },
          error: (err: any) => {
            // Esta funcion es solo mientras la api no acepte los delete
            this.delete.emit(heroId);   
            //Este mensaje es el que debería imprimir si hay un error
            //this.message.openSnackBar('Se ha producido un error');    
          }
        });     
        console.log('Delete')
      }
    });
  }

}
