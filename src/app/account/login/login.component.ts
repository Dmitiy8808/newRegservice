import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { WebSocketService } from 'src/app/shared/web-socket.service';
import { Subscription } from 'rxjs';
import { WSMessage } from 'src/app/shared/models/wsMessage';
import { NativeMessageCode } from 'src/app/shared/constants/native-message-code.constant';
import { WSMessageResponse } from 'src/app/shared/models/wsMessageResponse';
import { isCertificateArray } from 'src/app/shared/models/certificate.guards';
import { isVersion } from 'src/app/shared/models/version.guards';
import { Certificate } from 'src/app/shared/models/certificate';
import { LoginData } from 'src/app/shared/models/loginData';
import { UserForLogOn } from 'src/app/shared/models/userForLogOn';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  isActualPluginVersion: boolean = true;
  isCryptoInitError: boolean = false;
  isSignError: boolean = false;
  isCryptoError: boolean = false;
  isPasswordVisible = false;
  errorMessage: string = '';
  unregisteredUserIsVisible: boolean = false;
  blockedUserIsVisible: boolean = false;
  certBlockedIsVisible: boolean = false;
  wrongLoginOrPasswordIsVisible: boolean = false;
  public showDialog: boolean = false;
  activeTab = 1;
  base64EncodedData: string = '';
  showModal: boolean = false;
  certificates: Certificate[] = [];
  private messagesSubscription?: Subscription;
  connectionStatus$ = this.webSocketService.connectionStatus$;

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private accountService: AccountService, private webSocketService: WebSocketService,
              private router: Router) { }

  onSubmitLogOnByPassword(): void {
    let formValues = this.loginForm.value;
    const userForLogOn: UserForLogOn = {
      login: formValues.login || "",      // if login is null or undefined, it will use the empty string
      password: formValues.password || "", // if password is null or undefined, it will use the empty string
      originalData: "",
      signedData: ""
    };
    this.accountService.login(userForLogOn).subscribe({
      next: response => {
        console.log(response);
        if (!response.isLoggedIn) {
          this.errorMessage = response.errorMessage;
          this.showDialog = true;
          if (this.errorMessage === 'Пользователь с указанным именем и паролем не найден') {
            this.wrongLoginOrPasswordIsVisible = true;
            //TODO форма восстановления пароля
          }
          if (this.errorMessage === 'Пользователь с указанным именем и паролем отключен') {
            this.blockedUserIsVisible = true;
          }

        }
        if (response.isLoggedIn) {
          console.log('Редиректим в закрытую часть', response);
          this.router.navigate(['/main']);
        }

      }
    });
  }

  hideModal() {
    this.showModal = false;
  }


  onSubmitLogOnByCertificate(signedData: string): void {
    const userForLogOn: UserForLogOn = {
      login: "",
      password: "",
      originalData: this.base64EncodedData,
      signedData: signedData
    };

    this.accountService.login(userForLogOn).subscribe({
      next: response => {
        if (!response.isLoggedIn) {
          this.errorMessage = response.errorMessage;
          this.showDialog = true;
          if (this.errorMessage === 'Не найдено пользователя с выбранным сертификатом') {
            this.unregisteredUserIsVisible = true;
          }
          if (this.errorMessage === 'Пользователь отключен') {
            this.blockedUserIsVisible = true;
          }
          if (this.errorMessage === 'Указанный сертификат находится в состоянии \'Заблокировано\'. Авторизация невозможна.') {
            this.certBlockedIsVisible = true;
            // TODO в этом кейсе нужно проверять сертифкат на отзыв и отправлять пользователю предупреждение.
            // а также уведомлять о таком случае администр
          }

        }
        if (response.isLoggedIn) {
          this.router.navigate(['/main']);
        }

      },
      error: err => {
        console.error('Error logging in:', err);
        // Handle the error scenario here
      }
    });
  }


  onCertClick(subjectKeyId: string): void {

    const randomData = this.generateRandomData(100);  // Generate a random string of 100 characters

    this.base64EncodedData = this.encodeBase64(randomData);

    const loginDataObject: LoginData = {
      Base64Data: this.base64EncodedData,
      SubjectKeyId: subjectKeyId
    };

    const dataString = JSON.stringify(loginDataObject);

    const message: WSMessage = {
      code: NativeMessageCode.getDataSignature,
      data: dataString
    };
    this.webSocketService.sendMessage(message);


  }

  setActiveTab(tabNumber: number): void {
    this.activeTab = tabNumber;
  }

  resetDialogState(): void {
    this.showDialog = false;
    this.blockedUserIsVisible = false;
    this.unregisteredUserIsVisible = false;
    this.certBlockedIsVisible = false;
    this.wrongLoginOrPasswordIsVisible = false;
    this.isActualPluginVersion = true;
    this.isSignError = false;
    this.isCryptoError = false;
    this.isCryptoInitError = false;
  }



  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  ngOnInit(): void {

    if (this.accountService.isLoggedIn()) {
      this.router.navigate(['main']);
    }

    this.webSocketService.connect();

    this.messagesSubscription = this.webSocketService.getMessages().subscribe(
      (response: WSMessageResponse) => {
        console.log('Received message:', response);
        if (response.Success) {
          if (typeof response.Data === 'string') {

            this.onSubmitLogOnByCertificate(response.Data);

          }
          else if (isVersion(response.Data)) {

            if (response.Data.version < 13) {
              this.isActualPluginVersion = false;
              this.errorMessage = 'Версия 1С.Тулбокс не актуальна';
              this.showDialog = true;
            }
          }
          if (isCertificateArray(response.Data)) {
            const currentDate = new Date();

            this.certificates = response.Data.filter(cert =>
              cert.Algorithm === "1.2.643.7.1.1.1.1" &&
              this.parseDate(cert.NotAfter) >= currentDate &&
              this.parseDate(cert.NotBefore) <= currentDate
            );
            this.certificates.forEach(cert => {
              const parsedSubject = this.parseSubjectName(cert.SubjectName);
              cert.CommonName = parsedSubject.CN as string;
              cert.Inn = parsedSubject.Inn as string;
              cert.Ogrn = parsedSubject.Ogrn as string;
              cert.Surname = parsedSubject.SN as string;
              cert.GivenName = parsedSubject.G as string;
              cert.InnUl = parsedSubject.InnUl as string;

            });

          }
        }
        if (!response.Success) {
          this.errorMessage = response.Message;
          this.showDialog = true;
          if (response.Message === 'Невозможно открыть сообщение для кодирования.')
          {
            this.isCryptoError = true;
          }
          if (response.Message === 'Ошибка загрузки данных в сообщение.')
          {
            this.isSignError = true;
          }
          if (response.Message === 'Ошибка инициализации криптопровайдера.')
          {
            this.isCryptoInitError = true;
          }
        }
      }
    );

    this.getVersion();
    this.getCertificateList();
  }

  getVersion(): void {
    const message: WSMessage = {
      code: NativeMessageCode.getVersion,
      data: ''
    };
    this.webSocketService.sendMessage(message);
  }

  getCertificateList(): void {
    const message: WSMessage = {
      code: NativeMessageCode.getCertificateList,
      data: ''
    };
    this.webSocketService.sendMessage(message);
  }

  parseSubjectName(subjectName: string): { CN?: string, Inn?: string, Ogrn?: string, SN?: string, G?: string, InnUl?: string } {
    const parts = subjectName.split(',').map(part => part.trim());
    let CN: string | undefined;
    let Inn: string | undefined;
    let Ogrn: string | undefined;
    let SN: string | undefined;
    let G: string | undefined;
    let InnUl: string | undefined;

    for (const part of parts) {
      if (part.startsWith('CN=')) {
        CN = part.substring(3).replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
      } else if (part.startsWith('ИНН=')) {
        Inn = part.substring(4);
      } else if (part.startsWith('INN=')) {
        Inn = part.substring(4);
      } else if (part.startsWith('OID.1.2.643.3.131.1.1=')) {
        Inn = part.substring(22);
      } else if (part.startsWith('ОГРН=')) {
        Ogrn = part.substring(5);
      } else if (part.startsWith('OGRN=')) {
        Ogrn = part.substring(5);
      } else if (part.startsWith('OID.1.2.643.100.1=')) {
        Ogrn = part.substring(18);
      } else if (part.startsWith('SN=')) {
        SN = part.substring(3);
      } else if (part.startsWith('G=')) {
        G = part.substring(2);
      } else if (part.startsWith('ИНН ЮЛ=')) {
        InnUl = part.substring(7);
      } else if (part.startsWith('INNLE=')) {
        InnUl = part.substring(6);
      } else if (part.startsWith('OID.1.2.643.100.4=')) {
        InnUl = part.substring(18);
      }
    }
    return {
      CN,
      Inn,
      Ogrn,
      SN,
      G,
      InnUl
    };
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);  // month is 0-based in JavaScript
  }

  generateRandomData(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  encodeBase64(input: string): string {
    const rawData = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(Number('0x' + p1))));
    return rawData;
  }


  ngOnDestroy(): void {
    this.messagesSubscription!.unsubscribe();
    this.webSocketService.close();
  }




}
