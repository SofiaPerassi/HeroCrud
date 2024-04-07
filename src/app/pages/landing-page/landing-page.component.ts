import { Component } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Hero } from '../../models/Hero';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroCardComponent,
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  heroes: any[] = [];
  filteredHeroes: Hero[] = [];
  search: string = '';
  carga: boolean = false;
  currentPage = 0;
  pageSize = 20;
  searchQuery: string = '';
  totalItems: number = 0;

  constructor(private marvelService: HeroesService, private router: Router, private message: MessageService) { }

  ngOnInit(): void {
    this.searchHeroes();
  }

  searchHeroes(): void {
    this.marvelService.searchHeroes(this.search, this.currentPage, this.pageSize)
      .subscribe(response => {
        this.heroes = response;
        this.filteredHeroes = this.heroes;
        this.totalItems = response.length;
        this.carga = true;
      });
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.searchHeroes();
    }
  }
  
  nextPage(): void {
    if (this.filteredHeroes.length === this.pageSize) {
      this.currentPage++;
      this.searchHeroes();
    }
  }
    

  applyFilter(): void {
    this.currentPage = 0;
    this.searchHeroes();
  }

  createHero(){
    this.router.navigate(['/create']);
  }

  editHero(id: string, name: string, description: string){
    this.router.navigate(['/create'], { queryParams: { id: id, name: name, description: description } });
  }

  deleteHero(heroId: string): void {
    //Se borra el heroe de manera local ya que la api no está preparada para ello
    this.filteredHeroes = this.heroes.filter(hero => hero.id !== heroId);
    this.message.openSnackBar('El héroe fue eliminado con éxito!');
  }
  
}
