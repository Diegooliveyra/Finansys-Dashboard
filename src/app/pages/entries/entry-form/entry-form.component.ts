import { CategoryService } from './../../categories/shared/category.service';
import { Category } from './../../categories/shared/category.model';
import { Entry } from "../shared/entry.model";
import { AfterContentChecked, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { EntryService } from "../shared/entry.service";
import toastr from "toastr";
@Component({
  selector: "app-entry-form",
  templateUrl: "./entry-form.component.html",
  styleUrls: ["./entry-form.component.scss"],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessagers: string[] = null;
  submitiingForm: boolean = false;
  entry: Entry = new Entry();

  categories: Array<Category> = []

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: "",
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ",",
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    today: "Hoje",
    clear: "Limpar",
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buidEntryForm();
    this.loadEntry();
    this.loadCategories()
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submitiingForm = true;
    if (this.currentAction === "new") {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return {
        value,
        text,
      };
    });
  }

  //Private Methods

  private setCurrentAction() {
    const currentPath = this.route.snapshot.url[0].path;
    this.currentAction = currentPath === "new" ? currentPath : "edit";
  }

  private buidEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      paid: [true, Validators.required],
      categoryId: [null, Validators.required],
    });
  }

  private loadEntry() {
    if (this.currentAction === "edit") {
      this.route.paramMap
        .pipe(
          switchMap((params) =>
            this.entryService.getByid(Number(params.get("id")))
          )
        )
        .subscribe(
          (entry: Entry) => {
            this.entry = entry;

            this.entryForm.patchValue(entry);
            // ou
            // this.entryForm.get('id').setValue(entry.id)
            // this.entryForm.get('name').setValue(entry.name)
            // this.entryForm.get('description').setValue(entry.description)
          },
          (error) => alert(`Ocorreu um erro, tente mais tarde! ${error}`)
        );
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe((category:any)=>{
      this.categories = category
    })
  }

  private setPageTitle() {
    if (this.currentAction === "new")
      this.pageTitle = "Cadastro de Novo Lançamento";
    else {
      const EntryName = this.entry.name || "";
      this.pageTitle = `Editando Lançamento: ${EntryName}`;
    }
  }

  private createEntry() {
    const entry = Entry.fromJson(this.entryForm.value)
    this.entryService.create(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionForError(error)
    );
  }

  private updateEntry() {
    const entry = Entry.fromJson(this.entryForm.value)
    this.entryService.update(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionForError(error)
    );
  }

  private actionsForSuccess(entry: any) {
    toastr.success("Solicitação processada com sucesso");

    //Redirect/Reload component page
    this.router
      .navigateByUrl(`/entries`, { skipLocationChange: true })
      .then(() => this.router.navigate(["entries", entry.id, "edit"]));
  }

  private actionForError(error: any) {
    toastr.error("Ocorreu um erro ao processar a solicitação");
    if (error.status === 422)
      this.serverErrorMessagers = JSON.parse(error._body).errors;
    else this.serverErrorMessagers = ["Falha na comunicação com o servidor"];
  }
}
