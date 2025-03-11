@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly API_URL = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  getExams(): Observable<any> {
    console.log('Getting exams...'); // Debug log
    return this.http.get(this.API_URL).pipe(
      tap(response => console.log('Exam response:', response)), // Debug log
      catchError(error => {
        console.error('Error fetching exams:', error);
        return throwError(() => error);
      })
    );
  }
} 