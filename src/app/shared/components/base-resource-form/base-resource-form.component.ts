import { AfterContentChecked, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import toastr from "toastr";

import { BaseResourceService } from "src/app/shared/services/base-resource.service";
import { BaseResource } from "src/app/shared/models/base-resource.model";

export abstract class BaseResourceFormComponent<T extends BaseResource>
  implements OnInit, AfterContentChecked
{
  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessagers: string[] = null;
  submitiingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected resourceService: BaseResourceService<T>,
    public resource: T,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submitiingForm = true;
    if (this.currentAction === "new") {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  //Private Methods

  protected setCurrentAction() {
    const currentPath = this.route.snapshot.url[0].path;
    this.currentAction = currentPath === "new" ? currentPath : "edit";
  }



  protected loadResource() {
    if (this.currentAction === "edit") {
      this.route.paramMap
        .pipe(
          switchMap((params) =>
            this.resourceService.getByid(Number(params.get("id")))
          )
        )
        .subscribe(
          (resource: T) => {
            this.resource = resource;

            this.resourceForm.patchValue(resource);
          },
          (error) => alert(`Ocorreu um erro, tente mais tarde! ${error}`)
        );
    }
  }

  protected setPageTitle() {
    if (this.currentAction === "new") this.pageTitle = this.createPageTitle();
    else {
      this.pageTitle = this.editPageTitle();
    }
  }

  protected createPageTitle(): string {
    return "novo";
  }

  protected editPageTitle(): string {
    return "edição";
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource).subscribe(
      (resource) => this.actionsForSuccess(resource),
      (error) => this.actionForError(error)
    );
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource).subscribe(
      (resource) => this.actionsForSuccess(resource),
      (error) => this.actionForError(error)
    );
  }

  protected actionsForSuccess(resource: any) {
    toastr.success("Solicitação processada com sucesso");
    const baseComponentPath = this.route.snapshot.parent.url[0].path;
    //Redirect/Reload component page
    this.router
      .navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() =>
        this.router.navigate([baseComponentPath, resource.id, "edit"])
      );
  }

  protected actionForError(error: any) {
    toastr.error("Ocorreu um erro ao processar a solicitação");
    if (error.status === 422)
      this.serverErrorMessagers = JSON.parse(error._body).errors;
    else this.serverErrorMessagers = ["Falha na comunicação com o servidor"];
  }

  protected abstract buildResourceForm(): void
}
