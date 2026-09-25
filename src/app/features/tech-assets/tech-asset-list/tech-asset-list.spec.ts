import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TechAssetListComponent } from './tech-asset-list';

describe('TechAssetListComponent', () => {
  let component: TechAssetListComponent;
  let fixture: ComponentFixture<TechAssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechAssetListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TechAssetListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
