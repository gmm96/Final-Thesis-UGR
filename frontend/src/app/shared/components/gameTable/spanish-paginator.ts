import {MatPaginatorIntl} from '@angular/material';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class MatPaginatorIntlSpa extends MatPaginatorIntl {
    itemsPerPageLabel = 'Ver';
    nextPageLabel = 'Página siguiente';
    previousPageLabel = 'Página anterior';
    firstPageLabel = 'Primera página';
    lastPageLabel = 'Última página';

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 de ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return startIndex + 1 + '-' + endIndex + ' de ' + length;
    };

}
