import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../modules/security/services/local-storage.service';
import { LocalStorageKeysService } from '../../modules/security/services/local-storage-keys.service';
import { LoginResponseDTO } from '../../modules/security/models/user-login-response.dto';
import { RoleEnum } from '../../modules/user/models/role.dto';

export const adminRoleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const localStorageService = inject(LocalStorageService);
    const keyService = inject(LocalStorageKeysService);
    const user = localStorageService.get<LoginResponseDTO>(keyService.USER_KEY);

    if (user != null) {

        const admin = user.roles.find(r => r.enumId == RoleEnum.Administrator);

        if (admin != undefined) {
            return true;
        } else {
            router.navigateByUrl('error');
            return false;
        }

    } else {
        router.navigateByUrl('error');
        return false;
    }
};
