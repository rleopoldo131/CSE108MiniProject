from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flask import redirect, url_for, request
from .models import User, Course, Enrollment
from .database import Session

# Optional: restrict access to only admins
class AdminOnlyView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.role == 'admin'

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('auth.login', next=request.url))

def init_admin(app):
    admin = Admin(app, name='Admin Panel', template_mode='bootstrap4')
    session = Session()

    admin.add_view(AdminOnlyView(User, session))
    admin.add_view(AdminOnlyView(Course, session))
    admin.add_view(AdminOnlyView(Enrollment, session))
