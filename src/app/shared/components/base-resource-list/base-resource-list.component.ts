import { OnInit } from "@angular/core";
import {BaseResource} from '../../models/base-resource.model'
import {BaseResourceService} from '../../services/base-resource.service'

export abstract class BaseResourceListComponent<T extends BaseResource> implements OnInit {
  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) {}

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      (resources) => (this.resources = resources),
      (error) => alert(error)
    );
  }

  deleteResource(id: number) {
    const mustDelete = confirm("Deseja mesmo excluir este item ?");

    if (mustDelete)
      this.resourceService.delete(id).subscribe(
        () => {
          this.resources = this.resources.filter(
            (element) => element.id !== id
          );
        },
        () => alert("Erro ao tentar excluir")
      );
  }
}
