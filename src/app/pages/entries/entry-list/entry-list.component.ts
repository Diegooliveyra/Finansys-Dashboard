import { Entry } from "./../shared/entry.model";
import { EntryService } from "./../shared/entry.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-entry-list",
  templateUrl: "./entry-list.component.html",
  styleUrls: ["./entry-list.component.scss"],
})
export class EntryListComponent implements OnInit {
  public entries: Entry[] = [];

  constructor(private entryService: EntryService) {}

  ngOnInit() {
    this.entryService.getAll().subscribe(
      (entries) => (this.entries = entries.sort((a,b)=> b.id - a.id)),
      (error) => alert(error)
    );
  }

  deleteEntry(id: number) {
    const mustDelete = confirm("Deseja mesmo excluir este item ?");

    if (mustDelete)
      this.entryService.delete(id).subscribe(
        () => {
          this.entries = this.entries.filter(
            (element) => element.id !== id
          );
        },
        () => alert("Erro ao tentar excluir")
      );
  }
}
