import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CATEGORY_API_URL } from '../../../app.constants';
import { Category } from '../model/category';
import { CategoryService } from '../service/category.service';

@Component({
	selector: 'app-category-edit',
	templateUrl: './category-edit.component.html',

	standalone: true,
	imports: [FormsModule, ReactiveFormsModule],
})
export class CategoryEditComponent implements OnInit {
	categoryForm = new UntypedFormGroup({
		id: new UntypedFormControl({ value: '', disabled: true }, Validators.minLength(2)),
		name: new UntypedFormControl(''),
		description: new UntypedFormControl(''),
	});

	constructor(
		private categoryService: CategoryService,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		const url = CATEGORY_API_URL + '/' + id;
		this.categoryService.getCategoryDetails(url).subscribe(
			(data) => {
				this.categoryForm.patchValue({
					id: data.id,
					name: data.name,
					description: data.description,
				});
			},
			(error) => {
				console.log(error);
			},
			() => {
				console.log('getCategoryDetails() success');
			},
		);
	}

	updateCategory() {
		const category = new Category(this.categoryForm.get('id').value);
		category.name = this.categoryForm.get('name').value;
		category.description = this.categoryForm.get('description').value;
		const url = CATEGORY_API_URL + '/update';

		this.categoryService.updateCategory(url, category).subscribe(
			(value) => {},
			(error1) => {},
			() => {
				this.router.navigate(['/category/list']);
			},
		);
	}

	goBack() {
		this.router.navigate(['/category/' + this.categoryForm.get('id').value]);
	}
}
