import { UIService } from './../../shared/ui.service';
import { BenefitsService } from './../benefits.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Benefit } from '../benefit.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-benefit-edit',
  templateUrl: './benefit-edit.component.html',
  styleUrls: ['./benefit-edit.component.scss'],
})
export class BenefitEditComponent implements OnInit {
  isAddMode: boolean;
  id: string;
  benefitsForm: FormGroup;
  benefit: Benefit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private benefitsService: BenefitsService,
    private uiService: UIService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.benefitsForm = this.fb.group({
      company: [''],
      companyType: [''],
      address: [''],
      offer: [''],
      note: [''],
    });

    if (!this.isAddMode) {
      this.benefitsService.fetchBenefit(this.id).pipe(
        first(),
      )
      .subscribe( item => {
        this.benefitsForm.patchValue(item);
      });
    }

  }


  onSubmit() {
    if (!this.benefitsForm.valid) {
      return;
    }
    if (this.isAddMode) {
      this.addBenefit();
    } else {
      this.updateBenefit();
    }
  }
  
  onCancel() {
    this.router.navigateByUrl('/benefits');
  }
  
  private addBenefit() {
    this.benefitsService.addBenefit(this.benefitsForm.value).subscribe( 
      () => {
        this.router.navigateByUrl('/benefits');
      },  error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      }
    )
  }

  private updateBenefit() {
    this.benefitsService.saveBenefit(this.id, this.benefitsForm.value).subscribe( 
      () => {
        this.router.navigateByUrl('/benefits');
      },  error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      }
    )
  }

}
