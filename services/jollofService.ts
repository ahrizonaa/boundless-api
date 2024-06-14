class JollofService {
	constructor() {}

	isProviderMismatched(existingProvider: string, userAccount: any) {
		return (
			(existingProvider == 'Google' && userAccount.user.GoogleUser == null) ||
			(existingProvider == 'Facebook' && userAccount.user.FacebookUser == null)
		);
	}
}

const jollofService = new JollofService();

export default jollofService;
