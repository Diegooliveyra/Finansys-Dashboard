import { Component, Input, OnInit } from "@angular/core";

interface BreadCrumb {
  text: "";
  link?: "";
}

@Component({
  selector: "app-bread-crumb",
  templateUrl: "./bread-crumb.component.html",
  styleUrls: ["./bread-crumb.component.scss"],
})
export class BreadCrumbComponent implements OnInit {
  @Input() items: Array<BreadCrumb> = [];

  constructor() {}

  ngOnInit() {}

  isLastItemList(item: BreadCrumb): boolean {
    const index = this.items.indexOf(item);
    return index + 1 == this.items.length;
  }
}
