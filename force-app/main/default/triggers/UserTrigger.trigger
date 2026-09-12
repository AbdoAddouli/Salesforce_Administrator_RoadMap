/*
 *  _   _ ___  __  __   _    _         _   _       _       _  __
 * | | | |_ _||  \/  | | |  | |_ _ ___| | | |_ _ _| |_ ___| |/ /__ _ _ __   __ _
 * | | | || | | |\/| | | |/\| | '_/ -_) |_| | ' \  _(_-< | ' </ _` | '_ \ / _` |
 *  \___/|___||_|  |_|  \_/\_/|_| \___\___/|_||_\__/ /__/ |_|\_\__,_| .__/ \__,_|
 *                                                                    |_|
 *
 * Thin trigger — onboarding metadata is stamped by the service layer.
 */
trigger UserTrigger on User (before insert, before update) {
  UserManagementService.applyOnboardingDefaults(Trigger.new);
}