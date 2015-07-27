(function() {

	'use strict';

	angular
		.module('iserveu')
		.factory('motion', motion);

	function motion($resource) {

		var Motion = $resource('api/motion/:id', {}, {
	        'update': { method:'PUT' }
	    });

	    var GetTopMotion = $resource('api/motion/', {
               rank_greater_than:0, take:1
		}, {});

	    var MotionComment = $resource('api/motion/:id/comment');

	    var MotionRestore = $resource('api/motion/:id/restore');

		var Comment = $resource('api/motion/getcomments/:id');

		var Vote = $resource('api/vote/:id', {}, {
	        'update': { method:'PUT' }
	    });

		var MyVote = $resource('api/user/:id/vote');

		var CommentVote = $resource('api/comment_vote/:id', {}, {
	        'update': { method:'PUT' }
	    });


		function getMotions() {
			return Motion.query({take:50}).$promise.then(function(results) {
				console.log(results);
				return results
			}, function(error) {
				console.log(error);
			});
		}

		function getTopMotion() {
			return GetTopMotion.query().$promise.then(function(results) {
				return results
			}, function(error) {
				console.log(error);
			});
		}

		function getMyVotes(id) {
			return MyVote.get({id:id}).$promise.then(function(results) {
				return results;
			}, function(error) {
				return error;
			});
		}

		function getMotion(id) {
			return Motion.get({id:id}).$promise.then(function(result) {
				return result;
			});
		}

		function updateMotion(data) {
			return Motion.update({id:data.id}, data).$promise.then(function(result) {
				return result;
			});
		}

		function createMotion(data) {
			return Motion.save(data).$promise.then(function(success) {
				return success;
			}, function(error) {
				return error;
			});
		}

		function deleteMotion(id) {
			return Motion.delete({id:id}).$promise.then(function(success) {
				return success;
			}, function(error) {
				return error;
			});

		}

		function restoreMotion(id) {
			return MotionRestore.get({id:id}).$promise.then(function(success) {
				return success;
			}, function(error) {
				return error;
			});
		}

		function getMotionComments(id) {
			return MotionComment.get({id:id}).$promise.then(function(result) {
				return result;
			});
		}


		function castVote(data) {
			return Vote.save(data).$promise.then(function(success) {
				console.log(success)
			}, function(error) {
				return error;
			});
		}

		function updateVote(data) {
			return Vote.update({id:data.id}, data).$promise.then(function(success) {
				console.log(success);
			}, function(error) {
				return error;
			});
		}

		function getUsersVotes() {
			return Vote.query().$promise.then(function(result) {
				return result;
			}, function(error) {
				return error;
			});
		}


		function saveCommentVotes(data) {
			return CommentVote.save(data).$promise.then(function(success) {
				console.log(success);
			}, function(error) {
				return error;
			});
		}

		function updateCommentVotes(data) {
			return CommentVote.update({id:data.id}, data).$promise.then(function(success) {
				console.log(success);
			}, function(error) {
				console.log(error);
			});
		}

		function deleteCommentVote(id) {
			return CommentVote.delete({id:id}).$promise.then(function(success) {
			}, function(error) {
				
			});
		}


		return {
			getMotions: getMotions,
			getMotion: getMotion,
			createMotion: createMotion,
			updateMotion: updateMotion,
			deleteMotion: deleteMotion,
			restoreMotion: restoreMotion,
			getMotionComments: getMotionComments,
			castVote: castVote,
			updateVote: updateVote,
			getUsersVotes: getUsersVotes,
			saveCommentVotes: saveCommentVotes,
			updateCommentVotes: updateCommentVotes,
			deleteCommentVote: deleteCommentVote,
			getTopMotion: getTopMotion,
			getMyVotes: getMyVotes
		}
	}
})();