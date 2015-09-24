    (function() {

    angular
        .module('iserveu')
        .controller('MotionController', MotionController);

    function MotionController($rootScope, $stateParams, $mdToast, $state, motion,
    vote, figure, UserbarService, ToastMessage, VoteService, FigureService) {

        var vm = this;

        vm.motionDetail = {};

        vm.motionVotes = {};
        vm.usersVote;

        vm.voting = {
            agree: false,
            abstain: false,
            disagree: false
        }

        vm.motionVotes = {
            disagree:{percent:0,number:0},
            agree:{percent:0,number:0},
            abstain:{percent:0,number:0}
        }

        vm.showDisagreeCommentVotes = false;
        vm.showAgreeCommentVotes = false;

        vm.userHasVoted = false;
        vm.userVoteId;
        vm.isLoading = true; // Used to turn loading circle on and off for motion page

        vm.editMotionMode = false;
        vm.editingMotion = false;

        vm.figures;
        vm.delete_figure = [{
            bool: false,
            motion_id: '',
            figure_id: ''
        }]


        vm.deleteMotion = function() {
            var toast = ToastMessage.delete_toast(" motion");

            $mdToast.show(toast).then(function(response) {
                if(response == 'ok') {
                    motion.deleteMotion($stateParams.id).then(function(result) {
                        $state.go('home');
                        refreshSidebar();    
                    }, function(error) {
                        ToastMessage.report_error(error);
                    });
                }
            });
        }

        vm.editMotion = function() {
            vm.editMotionMode = !vm.editMotionMode;
        }

        vm.editMotionSwitch = function() {
            var toast = ToastMessage.action("Discard changes?", "Yes");

            $mdToast.show(toast).then(function(response){
                if(response == 'ok'){
                    vm.editMotion();
                }
            })
        }

        vm.updateMotion = function() {
            vm.editingMotion = true;

            var data = {
                text: vm.motionDetail.text,
                summary: vm.motionDetail.summary,
                active: vm.motionDetail.active,
                closing: vm.motionDetail.closing.carbon.date,
                id: $stateParams.id,
                department_id: vm.motionDetail.department_id
            }

            motion.updateMotion(data).then(function(result) {
                vm.editMotion();
                vm.editingMotion = false;
                uploadFigure();
                deleteFigures();
                getMotion(result.id);
                ToastMessage.simple("You've successfully updated this motion!");
            }, function(error) {
                ToastMessage.report_error(error);
            });
        }


        function getMotion(id) {
            motion.getMotion(id).then(function(result) {
                vm.motionDetail = result;
                vm.isLoading = false; 
                UserbarService.title = result.title;
            });  

            getFigures(id);
        }

        // figures section is questionable, maybe abstract this whole section ... figures.tpl.html, figures.ctr.js, etc.


        function getFigures(id){    // unnecessary step 
            FigureService.getFigures(id).then(function(result) {
                vm.figures = result;
            });
        }

        vm.deleteFigure = function(bool, motion_id, figure_id) {
            vm.delete_figure[figure_id] = {
                bool: !bool,
                motion_id: motion_id,
                figure_id: figure_id
            }
        }

        vm.upload = function(flow) {
            vm.formData = new FormData();
            vm.formData.append("file", flow.files[0].file);
        }

        function uploadFigure(){
            if(vm.formData){
              FigureService.uploadFile(vm.formData, $stateParams.id);
            }
        }

        function deleteFigures(){
            angular.forEach(vm.delete_figure, function(figure, key) {
                if(figure.bool){
                    FigureService.deleteFigure(figure.motion_id, figure.figure_id);
                }
            })
        }

        // motion voting, gotta abstract into service/ new controller

        function getMotionOnGetVoteSuccess(){
            motion.getMotion($stateParams.id).then(function(result){
                turnOffLoadingVotingAnimation();

                vm.motionDetail = result;
                getMotionVotes(result.id);
                getUsersVotes();
                $rootScope.$emit('getMotionComments', {id: $stateParams.id});
                refreshSidebar();
            })
        }

        function getMotionVotes(id){
            vote.getMotionVotes(id).then(function(results){
                calculateVotes(results);
            });
        }

        function calculateVotes(vote_array){
            if(vote_array[-1]){
                vm.motionVotes.disagree = vote_array[-1].active;
            }
            if(vote_array[1]){
                vm.motionVotes.agree = vote_array[1].active;
            }
            if(vote_array[0]){
                vm.motionVotes.abstain = vote_array[0].active;
            }

            if(vm.motionVotes.disagree.number>vm.motionVotes.agree.number){
                vm.motionVotes.position = "thumb-down";
            } else if(vm.motionVotes.disagree.number<vm.motionVotes.agree.number){
                vm.motionVotes.position = "thumb-up";
            } else {
                vm.motionVotes.position = "thumbs-up-down";
            } 
            
        }

        vm.castVote = function(position) {
            var message;
            switch(position) {
                case -1: 
                    message = " disagree with ";
                    vm.voting.disagree = true;
                    break;
                case 1:
                    message = " agreed with ";
                    vm.voting.agree = true;
                    break;
                default:
                    message = message+" abstained from voting on ";
                    vm.voting.abstain = true;
            }

            var data = {
                motion_id:$stateParams.id,
                position:position
            }
            
            if(!vm.userHasVoted) {
                vote.castVote(data).then(function(result) {
                    getMotionOnGetVoteSuccess();
                    ToastMessage.simple("You"+message+"this motion");
                }, function(error) {
                    turnOffLoadingVotingAnimation();
                    ToastMessage.report_error(error);
                });
            }
            else updateVote(data.position);

            }

        function turnOffLoadingVotingAnimation(){
            angular.forEach(vm.voting, function(value, position){
                vm.voting[position] = false;
            })
        }

        function updateVote(position){
            var data = {
                id: vm.userVoteId,
                position:position,
            }

            vote.updateVote(data).then(function(result) {

                getMotionOnGetVoteSuccess();
                ToastMessage.simple("You've updated your vote");

            }, function(error) {
                ToastMessage.report_error(error);
                turnOffLoadingVotingAnimation();
            });
        }

        function getUsersVotes() {
            vote.getUsersVotes().then(function(result) {
                angular.forEach(result, function(value, key) {
                    if(value.motion_id == $stateParams.id) {
                        vm.usersVote = parseInt(value.position);
                        vm.userHasVoted = true;
                        vm.userVoteId = value.id;
                        showCommentVoteColumn();
                    }
                });
            });
        }        

        function showCommentVoteColumn(){
            if(vm.usersVote == 1) {
                vm.showDisagreeCommentVotes = false;
                vm.showAgreeCommentVotes = true;
            }
            if(vm.usersVote != 1) {
                vm.showAgreeCommentVotes = false;
                vm.showDisagreeCommentVotes = true;
            }
        }

        getUsersVotes();
        getMotionVotes($stateParams.id);

        // end refactor of vote ctr/svc
        function refreshSidebar(){
            $rootScope.$emit('refreshMotionSidebar');
        }

        getMotion($stateParams.id);
    }

}());