import { Category } from './pages/categories/shared/category.model';
import { InMemoryDbService } from "angular-in-memory-web-api";

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: "Moradia", description: "Pagamentos de Conta da Casa" },
      { id: 2, name: "Saúde", description: "Plano de saúde e Remédios" },
      { id: 3, name: "Lazer", description: "Cinema, parque, praia etc" },
      { id: 4, name: "Salário", description: "Recebimento de Salário" },
      { id: 5, name: "Freelas", description: "Trabalhos como Freelancer" }
    ];

    return {categories};
  }
}
