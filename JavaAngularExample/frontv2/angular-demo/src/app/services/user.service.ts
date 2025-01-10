import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GenericResponse, GenericsResponse } from "../models/system/generic-response.model";
import { User } from "../models/user/user.model";

@Injectable({
    providedIn: 'root',
})
export class UserSerivce {
    private apiUrl: string = 'http://localhost:8080/api/users';
    readonly http = inject(HttpClient);

    getUsers(): Observable<GenericsResponse<User>> {
        return this.http.get<GenericsResponse<User>>(this.apiUrl);
    }

    getUserByName(name: string): Observable<GenericResponse<User>> {
        const url: string = `${this.apiUrl}/search?name=${name}`;
        return this.http.get<GenericResponse<User>>(url);
    }

    getUserById(id: string): Observable<GenericResponse<User>> {
        const url: string = `${this.apiUrl}/get-user-id/${id}`;
        return this.http.get<GenericResponse<User>>(url);
    }

}
