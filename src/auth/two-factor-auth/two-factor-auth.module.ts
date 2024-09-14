import { Module } from '@nestjs/common'

import { MailService } from '@/libs/mail/mail.service'

import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
	providers: [TwoFactorAuthService, MailService]
})
export class TwoFactorAuthModule {}
