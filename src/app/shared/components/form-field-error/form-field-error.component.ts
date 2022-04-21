import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-form-field-error",
  templateUrl: "./form-field-error.component.html",
  styleUrls: ["./form-field-error.component.scss"],
})
export class FormFieldErrorComponent implements OnInit {
  @Input() control: FormControl;

  constructor() {}

  ngOnInit() {}

  public errorMessage(): string | null {
    if (this.mustShowErrorMessage()) return this.getErrorMessage();
    else return null;
  }

  private mustShowErrorMessage(): boolean {
    return this.control.invalid && this.control.touched;
  }

  private getErrorMessage(): string | null {
    if (this.control.errors.required)
      return "dado obrigatório";

    else if (this.control.errors.email)
      return "formato de email invalido";

    else if (this.control.errors.minlength) {
      const requiredLenght = this.control.errors.minlength.requiredLength;
      return `deve ter no mínimo ${requiredLenght} caracteres`;

    } else if (this.control.errors.maxlength) {
      const requiredLenght = this.control.errors.maxlength.requiredLength;
      return `deve ter no máximo ${requiredLenght} caracteres`;
    }
  }
}
