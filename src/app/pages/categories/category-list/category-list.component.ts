import { Category } from "./../shared/category.model";
import { CategoryService } from "./../shared/category.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit {
  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      (categories) => (this.categories = categories),
      (error) => alert(error)
    );
  }

  deleteCategory(id: number) {
    const mustDelete = confirm("Deseja mesmo excluir este item ?");

    if (mustDelete)
      this.categoryService.delete(id).subscribe(
        () => {
          this.categories = this.categories.filter(
            (element) => element.id !== id
          );
        },
        () => alert("Erro ao tentar excluir")
      );
  }
}
