import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechAssetForm } from './tech-asset-form';

describe('TechAssetForm', () => {
  let component: TechAssetForm;
  let fixture: ComponentFixture<TechAssetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechAssetForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TechAssetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
