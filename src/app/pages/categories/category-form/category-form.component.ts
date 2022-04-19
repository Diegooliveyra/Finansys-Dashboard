import { Component, Injector } from "@angular/core";
import { Validators } from "@angular/forms";

import { Category } from "./../shared/category.model";
import { CategoryService } from "../shared/category.service";
import { BaseResourceFormComponent } from "src/app/shared/components/base-resource-form/base-resource-form.component";
@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.scss"],
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {
  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(categoryService, new Category(), injector, Category.fromJson);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, Validators.required],
    });
  }

  protected createPageTitle(): string {
    return "Criar Nova Categoria";
  }

  protected editPageTitle(): string {
    const categoryName = this.resource.name || "";
    return `Editando Categoria: ${categoryName}`;
  }
}
