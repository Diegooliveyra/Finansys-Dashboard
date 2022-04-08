import { Category } from "./../shared/category.model";
import { AfterContentChecked, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { CategoryService } from "../shared/category.service";
import toastr from "toastr";
@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.scss"],
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessagers: string[] = null;
  submitiingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buidCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(event: any) {
    this.submitiingForm = true;
    if (this.currentAction === "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  //Private Methods

  private setCurrentAction() {
    const currentPath = this.route.snapshot.url[0].path;
    this.currentAction = currentPath === "new" ? currentPath : "edit";
  }

  private buidCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, Validators.required],
    });
  }

  private loadCategory() {
    if (this.currentAction === "edit") {
      this.route.paramMap
        .pipe(
          switchMap((params) =>
            this.categoryService.getByid(Number(params.get("id")))
          )
        )
        .subscribe(
          (category: Category) => {
            this.category = category;

            this.categoryForm.patchValue(category);
            // ou
            // this.categoryForm.get('id').setValue(category.id)
            // this.categoryForm.get('name').setValue(category.name)
            // this.categoryForm.get('description').setValue(category.description)
          },
          (error) => alert(`Ocorreu um erro, tente mais tarde! ${error}`)
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction === "new")
      this.pageTitle = "Cadastro de Nova Categoria";
    else {
      const CategoryName = this.category.name || "";
      this.pageTitle = `Editando Categoria: ${CategoryName}`;
    }
  }

  private createCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionForError(error)
    );
  }

  private updateCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value)
    this.categoryService.update(category).subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionForError(error)
    )
  }

  private actionsForSuccess(category: any) {
    toastr.success("Solicitação processada com sucesso");

    //Redirect/Reload component page
    this.router
      .navigateByUrl(`/categories`, { skipLocationChange: true })
      .then(() => this.router.navigate(["categories", category.id, "edit"]));
  }

  private actionForError(error: any) {
    toastr.error("Ocorreu um erro ao processar a solicitação");
    if (error.status === 422)
      this.serverErrorMessagers = JSON.parse(error._body).errors;
    else this.serverErrorMessagers = ["Falha na comunicação com o servidor"];
  }
}
